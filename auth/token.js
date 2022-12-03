const jwt = require('jsonwebtoken')
const { tokenTypes, accessTokenSecret, refreshTokenSecret } = require('../config/auth')
const ApiError = require('../utils/ApiError')

const getAuthenticationToken = (user) => {
  const accessToken = jwt.sign({
    id: user._id,
    type: tokenTypes.accessToken
  }, accessTokenSecret, { expiresIn: '20m' })

  const refreshToken = jwt.sign({
    id: user._id,
    type: tokenTypes.refreshToken
  }, refreshTokenSecret, { expiresIn: '1d' })
  return { accessToken, refreshToken }
}

const getAccessToken = (refreshToken) => {
  try {
    const { id, type } = jwt.verify(refreshToken, refreshTokenSecret)
    if (type !== tokenTypes.refreshToken) {
      throw new ApiError('Invalid token', 401)
    }
    const accessToken = jwt.sign({
      id,
      type: tokenTypes.accessToken
    }, accessTokenSecret, { expiresIn: '20m' })
    return accessToken
  } catch (err) {
    throw new ApiError('Invalid Refresh Token', 401)
  }
}

module.exports = { getAuthenticationToken, getAccessToken }
