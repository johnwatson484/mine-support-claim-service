const db = require('../models')

module.exports = async function receive (claim) {
  console.log('claim received - %O', claim)
  const existingUser = await db.users.findOne({
    where: {
      email: claim.email
    }
  })

  if (existingUser != null) {
    console.log('existing user, no action required')
    return
  }

  console.log('creating new user')
  await db.users.upsert({
    email: claim.email
  })
}
