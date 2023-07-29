module.exports = {
  apps : [{
    name   : "mxs-log:3030",
    script : "./index.js",
    env_development: {
      NODE_ENV: "development",
      SERVICE_NAME:"mxs-log",
      SERVICE_PORT:3030,
      MONGO_URI_LOG:"mongodb://10.0.4.12/mxs_audit",
      KAFKA_CLIENT_ID:"ms-log-01",
      KAFKA_BROKERS:"10.0.4.12:9092",
      REDIS_URL:"redis://10.0.4.12:6379",
      REDIS_PASS:"mxV@Dev.2o22",
      JWT_KEY:"123456"
    },
    env_staging: {
      NODE_ENV: "staging",
      SERVICE_NAME:"mxs-log",
      SERVICE_PORT:3030,
      MONGO_URI_LOG:"mongodb://10.0.196.21/mxs_audit",
      KAFKA_CLIENT_ID:"ms-log-01",
      KAFKA_BROKERS:"10.0.196.11:9092",
      REDIS_URL:"redis://10.0.196.11:6379",
      REDIS_PASS:"mxV@Dev.2o22",
      JWT_KEY:"123456"
    }
  }]
}
