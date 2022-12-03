const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const bcrypt = require('bcryptjs')
const { getAuthenticationToken, getAccessToken } = require('../auth/token')

const checkIfUserExists = async (email) => {
  const user = await User.findOne({ email })
  return user
}

exports.register = async (req, res) => {
  const {
    email, password, firstName, lastName
  } = req.body
  const name = `${firstName} ${lastName}`
  if (await checkIfUserExists(email)) {
    throw new ApiError('User with given email or handle already exists', 409)
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  console.log(await User.create({
    email, password: hashedPassword, name
  }))
  return res.status(200).json({ success: true })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const user = await checkIfUserExists(email)
  if (!user) {
    throw new ApiError('User with given email or handle does not exist', 401)
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (isPasswordCorrect) {
    const token = getAuthenticationToken(user)
    res.send(token)
  } else {
    throw new ApiError('Incorrect Password', 401)
  }
}

exports.getAccessToken = async (req, res) => {
  const tokenHeader = req.header('authorization')
  if (!tokenHeader) throw new ApiError('No token provided', 401)

  const token = tokenHeader.split(' ')[1]
  const accessToken = getAccessToken(token)
  res.status(200).json({ accessToken })
}
