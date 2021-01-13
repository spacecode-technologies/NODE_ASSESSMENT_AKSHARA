const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.send('GET request are disabled')
//     }else{
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down')
// })

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({ _id: 'abc123' }, 'thisismysecretkey', { expiresIn: '1 day' })
    console.log(token)

    const data = jwt.verify(token, 'thisismysecretkey')
    console.log(data)
}

myFunction()

module.exports = app;