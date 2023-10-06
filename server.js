import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import 'dotenv/config';

//controllers import
import signupController from './controllers/signup.js';
import signinController from './controllers/signin.js';
import profileController from './controllers/profile.js';
import imageController from './controllers/image.js';
import usersController from './controllers/users.js';
import handleAPI from './controllers/handleAPI.js'

//db knex instance import
import knexInstance from './db.js'

//env variables declaration
const PORT = process.env.PORT

//server initialization
const app = express();
app.use(bodyParser.json());
app.use(cors());

//routes 
app.get('/', usersController(knexInstance));
app.post('/signin', signinController(knexInstance, bcrypt));
app.post('/signup', signupController(knexInstance, bcrypt));
app.get('/profile/:id', profileController(knexInstance));
app.put('/image', imageController(knexInstance));
app.post('/imageurl', (req, res) => handleAPI(req, res));

//start server
app.listen(PORT, () => {
   console.log(`server is running on port ${PORT}`)
})