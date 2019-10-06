const rheaPromise = require('rhea-promise')
const config = require('../config')

module.exports = async function receive () {
  const connectionOptions = setConnectionOptions(config.messageQueue)
  const connection = new rheaPromise.Connection(connectionOptions)
  const receiverOptions = configureReceiver(config.messageQueue.queue)

  await connection.open()
  const receiver = await connection.createReceiver(receiverOptions)

  receiver.on(rheaPromise.ReceiverEvents.message, (context) => {
    console.log('received claim - %O', context.message.body)
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

function setConnectionOptions (config) {
  return {
    transport: config.transport,
    host: config.host,
    hostname: config.hostname,
    username: config.username,
    password: config.password,
    port: config.port,
    reconnect: true
  }
}
