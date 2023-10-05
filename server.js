import express from 'express'
import bodyParser from 'body-parser'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import knex from 'knex';

const knexInstance = knex({
   client: 'pg',
   connection: {
     host: '127.0.0.1',
     port: 5433,
     user: 'postgres',
     password: '1408',
     database: 'facerecognizer',
   },
 });

 knexInstance.select('*')
  .from('users')
  .then(data => console.log(data))

const db = {
   users: [
      {
         id: 1,
         name: 'john',
         email: 'john@gmail.com',
         password: '123',
         entries: 0,
         joined_at: new Date()
      },
      {
         id: 2,
         name: 'q',
         email: 'q',
         password: '$2a$08$/NR7MQEKq0qbZWImw3wpNuEeQA/PqCQYOZlfPj99uz43sjjKmOa9.',
         entries: 0,
         joined_at: new Date()
      },
   ]
}

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
   res.send(db.users)
})

app.post('/signin', (req, res) => {
   const { email, password } = req.body

   let found = false
   db.users.forEach(user => {
      if (user.email == email && bcrypt.compareSync(password, user.password)) {
         found = true
         res.status(200).send(user)
      }
   })
   if (!found) res.status(400).send({error: 'not found'})
})

app.post('/signup', (req, res) => {
   const { name, email, password } = req.body
   var hash = bcrypt.hashSync(password, 8);
   knexInstance('users').insert({
      email,
      name,
      joined_at: new Date()
   }).then(data => console.log(data))
   
   res.send(db.users[db.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
   const { id } = req.params
   let found = false
   db.users.forEach(user => {
      if (user.id == id) {
         found = true
         res.send(user)
      }
   })
   if (!found) res.status(400).send('not found')
})

app.put('/image', (req, res) => {
   const { id } = req.body
   let found = false

   db.users.forEach(user => {
      if (user.id == id) {
         found = true
         user.entries++
         res.send({entries: user.entries})
      }
   })
   if (!found) res.sendStatus(400)
})

app.listen(3000, () => {
   console.log('server is running on port 3000')
})