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

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
   knexInstance.select('*').from('users')
   .then(users => res.json(users))
})

app.post('/signin', (req, res) => {
   const { email, password } = req.body

   knexInstance.select('email', 'hash').from('login')
   .where('email', '=', email)
   .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if(isValid) {
         return knexInstance.select('*').from('users')
         .where('email', '=', email)
         .then(user => res.json(user[0]))
         .catch(err => res.status(400).json('some error`s happened'))
      }
   })
   .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/signup', (req, res) => {
   const { name, email, password } = req.body
   var hash = bcrypt.hashSync(password, 8);
   knexInstance.transaction(trx => {
      trx.insert({
         hash,
         email
      })
         .into('login')
         .returning('email')
         .then(loginEmail => {
            return trx('users')
               .returning('*')
               .insert({
                  email: loginEmail[0].email,
                  name,
                  joined_at: new Date()
               })
               .then(user => res.send(user[0]))
         })
         .then(trx.commit)
         .catch(trx.rollback)
   })
      .catch(err => {
         console.log(err)
         res.status(400).send('some error`s happened')})
})

app.get('/profile/:id', (req, res) => {
   const { id } = req.params
   knexInstance
      .select('*')
      .from('users')
      .where({ id })
      .then(result => {
         if (result.length) res.send(result[0])
         else res.status(400).send('not found')
      })
      .catch(err => res.status(400).send(err))
})

app.put('/image', (req, res) => {
   const { id } = req.body

   knexInstance('users').where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(result => {
         if (result.length) res.json(result[0].entries)
         else res.status(400).json('some error happened')
      }
      )
      .catch(err => res.status(400).json('some error happened'))
})

app.listen(3000, () => {
   console.log('server is running on port 3000')
})