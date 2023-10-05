import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';

import signupRoute from './controllers/signup.js';
import signinRoute from './controllers/signin.js';
import profileRoute from './controllers/profile.js';
import imageRoute from './controllers/image.js';
import usersRoute from './controllers/users.js';

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

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', usersRoute(knexInstance));
app.post('/signin', signinRoute(knexInstance, bcrypt));
app.post('/signup', signupRoute(knexInstance, bcrypt));
app.get('/profile/:id', profileRoute(knexInstance));
app.put('/image', imageRoute(knexInstance));

app.listen(3000, () => {
   console.log('server is running on port 3000')
})