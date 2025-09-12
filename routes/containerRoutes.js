const express = require('express')
const containerController = require('./../controllers/containerController')
const { protect } = require('./../middlewares/protectMiddleware')

const router = express.Router()

router
    .post('/createContainer', protect, containerController.createContainer)
    .delete('/deleteContainer', protect, containerController.removeContainer)
    .patch('/restartContainer', protect, containerController.restartContainer)

module.exports = router