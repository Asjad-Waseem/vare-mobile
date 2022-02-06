'use strict'

const { NODE_ENV } = process.env

if (NODE_ENV === 'production') {
  module.exports = require('./configureStore.prod')
} else {
  module.exports = require('./configureStore.dev')
}
