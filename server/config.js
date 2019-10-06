const joi = require('@hapi/joi')
const envs = ['development', 'test', 'production']

const schema = joi.object().keys({
  port: joi.number().default(3001),
  env: joi.string().valid(...envs).default(envs[0]),
  messageQueue: joi.object().keys({
    transport: joi.string().default('tcp'),
    host: joi.string(),
    hostname: joi.string(),
    username: joi.string(),
    password: joi.string(),
    port: joi.number().default(5672),
    queue: joi.string().default('claim')
  })
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  messageQueue: {
    transport: process.env.MESSAGE_TRANSPORT,
    host: process.env.MESSAGE_HOST,
    hostname: process.env.MESSAGE_HOST,
    username: process.env.CLAIM_MESSAGE_USERNAME,
    password: process.env.CLAIM_MESSAGE_PASSWORD,
    port: process.env.MESSAGE_PORT,
    queue: process.env.CLAIM_MESSAGE_QUEUE
  }
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
