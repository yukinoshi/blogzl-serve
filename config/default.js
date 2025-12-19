const Mysqlconfig = {
  database: {
    HOST: 'localhost',
    PORT: 3306,
    DATABASE: 'blog',
    USERNAME: 'root',
    PASSWORD: '123456'
  }
}

const RedisConfig = {
  redis: {
    host: 'localhost',
    port: 6379,
    password: ''
  }
}

const config = {
  port: 3000,
  Mysqlconfig,
  RedisConfig,
  AiapiKey: 'xxxxxxx', // 请替换为你的AI接口Key
  AiVersion: 'v1', // 当前AI接口版本号，用于缓存区分
}

export default config