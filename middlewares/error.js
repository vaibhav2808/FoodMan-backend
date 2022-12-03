const ApiError = require('../utils/ApiError')

const errConverter = (err) => {
  if (!(err instanceof (ApiError))) {
    const message = err.message || 'Something went wrong'
    const statusCode = err.statusCode || 500
    err = new ApiError(message, statusCode)
  }
  return err
}

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = errConverter(err)
  const response = {
    code: statusCode,
    message
  }
  console.log(err)
  res.status(statusCode).send(response)
}

module.exports = { errorHandler }
