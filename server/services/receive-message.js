const rheaPromise = require('rhea-promise')
const config = require('../config')

module.exports = async function receive () {
  let connectionOptions = {}

  try {
    connectionOptions = parseConnectionString(config.messageConnectionString)
  } catch (err) {
    console.error('unable to parse connection string', err)
  }

  const connection = new rheaPromise.Connection(connectionOptions)
  const receiverOptions = configureReceiver(config.messageQueue)

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

function parseConnectionString (connectionString) {
  const hostFlag = 'Endpoint=sb://'
  const hostFlagLocation = connectionString.indexOf(hostFlag)
  const sharedAccessKeyNameFlag = ';SharedAccessKeyName='
  const sharedAccessKeyNameFlagLocation = connectionString.indexOf(sharedAccessKeyNameFlag)
  const sharedAccessKeyFlag = ';SharedAccessKey='
  const sharedAccessKeyFlagLocation = connectionString.indexOf(sharedAccessKeyFlag)
  const entityPathFlag = ';EntityPath='
  const entityPathLocation = connectionString.indexOf(entityPathFlag)
  const host = connectionString.substring(hostFlagLocation + hostFlag.length, sharedAccessKeyNameFlagLocation).replace('/', '')
  const sharedAccessKeyName = connectionString.substring(sharedAccessKeyNameFlagLocation + sharedAccessKeyNameFlag.length, sharedAccessKeyFlagLocation)
  const SharedAccessKey = connectionString.substring(sharedAccessKeyFlagLocation + sharedAccessKeyFlag.length, entityPathLocation > -1 ? entityPathLocation : connectionString.length)

  const connectionOptions = {
    transport: 'ssl',
    host: host,
    hostname: host,
    username: sharedAccessKeyName,
    password: SharedAccessKey,
    port: 5671
  }
  console.log('connection string parsed')
  return connectionOptions
}
