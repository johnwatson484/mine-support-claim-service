const rheaPromise = require('rhea-promise')
const config = require('../config')
const claimService = require('./claim-service')

module.exports = async function receive () {
  const connectionOptions = setConnectionOptions(config.messageQueue)
  const connection = new rheaPromise.Connection(connectionOptions)
  const receiverOptions = configureReceiver(config.messageQueue.queue)

  await connection.open()
  const receiver = await connection.createReceiver(receiverOptions)

  receiver.on(rheaPromise.ReceiverEvents.message, (context) => {
    claimService(context.message.body)
  })
  receiver.on(rheaPromise.ReceiverEvents.receiverError, (context) => {
    const receiverError = context.receiver && context.receiver.error
    if (receiverError) {
      console.log('receiver error', receiverError)
    }
  })
}

function configureReceiver (address) {
  return {
    name: 'mine-support-claim-service',
    source: {
      address
    },
    onSessionError: (context) => {
      const sessionError = context.session && context.session.error
      if (sessionError) {
        console.error('session error', sessionError)
      }
    }
  }
}

function setConnectionOptions (connConfig) {
  return {
    transport: connConfig.transport,
    host: connConfig.host,
    hostname: connConfig.hostname,
    username: connConfig.username,
    password: connConfig.password,
    port: connConfig.port,
    reconnect: true
  }
}
