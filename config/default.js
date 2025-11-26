const Mysqlconfig = {
  port: 3000,
  database: {
    HOST: 'localhost',
    PORT: 3306,
    DATABASE: 'blog',
    USERNAME: 'root',
    PASSWORD: '123456'
  }
}

const RedisConfig = {
  port: 3001,
  redis: {
    host: 'localhost',
    port: 6379,
    password: ''
  }
}

const config = {
  Mysqlconfig,
  RedisConfig
}

export default config