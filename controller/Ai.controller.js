import OpenAI from "openai";
import config from '../config/default.js'
import redis from '../model/redis.js'

const openai = new OpenAI({
  apiKey: config.AiapiKey,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

// 生成文章总结列表的 Redis Key
const getSummaryisKey = (params) => {
  const { articleId } = params;
  return `ai:${config.AiVersion}:article:summary:${articleId}`;
}
//消息和返回函数
const streamReply = async (message, callback) => {
  const stream = await openai.chat.completions.create({
    model: "qwen-plus",
    messages: [{
      role: "system",
      content: `
        你是一个博客系统的智能助手，请严格完成以下任务：
        1. 根据用户输入的文章内容生成不超过 50 字的中文摘要
        2. 提取 3~5 个关键词 (格式为 关键词：关键词, 关键词, 关键词)

        请只返回摘要不要输出多余文字
        `.trim()
    }, { role: "user", content: message }],
    stream: true,
  });
  callback(stream);
}

export const getAiReply = async (req, res) => {
  const { message, articleId } = req.body;
  // 1) 一次性写头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const writeSSE = (data) => res.write(data);

  try {
    const rediskey = getSummaryisKey({ articleId })
    const redisData = await redis.get(rediskey)
    if (redisData) {
      writeSSE(redisData);
      return res.end();
    } else {
      let responseData;
      await streamReply(message, async (stream) => {
        for await (const chunk of stream) {
          const token = chunk.choices?.[0]?.delta?.content || "";
          if (token) {
            writeSSE(token); // 持续推送
            responseData = (responseData || "") + token;
          }
        }
        // 将结果存入 Redis，不设置过期时间
        redis.set(rediskey, JSON.stringify(responseData))
        res.end();
      })
    };
  } catch (err) {
    console.error(err);
    writeSSE(JSON.stringify({ error: 'Failed to get AI reply' }));
    res.end();
  }
}

