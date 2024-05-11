const express = require('express')
const router = express.Router()

const users = require('../controller/user.controller')

router.post('/user', users.add)
router.put('/user/:id', users.update)
router.get('/user/:id', users.get)
router.get('/user', users.getAll)
router.delete('/user/:id', users.delete)
router.post('/user/login', users.login)

module.exports = router