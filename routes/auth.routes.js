const express = require('express')

const router = express.Router()
const { authController } = require('../controllers')
const catchAsync = require('../utils/catchAsync')

router.post(
  '/register',
  catchAsync(authController.register)
)

router.post(
  '/login',
  catchAsync(authController.login)
)

router.get(
  '/getAccessToken',
  catchAsync(authController.getAccessToken)
)

module.exports = router
