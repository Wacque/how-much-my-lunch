const express = require('express')
const app  = express()
const router = require('./router/index')

app.post('/login', router.login)
app.post('/orderquery', router.order_query)
app.post('/setusermes', router.setUserMes)
app.post('/getUserMes', router.getUserMes)
app.listen(3002)