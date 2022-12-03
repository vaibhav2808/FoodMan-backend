const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const User = require('../models/User')

const authConfig = require('../config/auth')
const { tokenTypes } = require('../config/auth')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authConfig.accessTokenSecret
}

module.exports = new JwtStrategy(opts, async (jwtPayload, done) => {
  if (jwtPayload.type !== tokenTypes.accessToken) {
    return done(null, false)
  }
  const user = await User.findById(jwtPayload.id)
  if (!user) {
    done('Invalid Token', false)
  } else {
    done(null, user)
  }
  return null
})
