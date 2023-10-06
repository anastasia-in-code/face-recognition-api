import knex from 'knex';

//env variables declaration
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

//initializing knex instance for db connection
// const knexInstance = knex({
//     client: 'pg',
//     connection: {
//         host: DB_HOST,
//         port: DB_PORT,
//         user: DB_USER,
//         password: DB_PASSWORD,
//         database: DB_NAME,
//     },
// });

const knexInstance = knex({
        client: 'pg',
        connection: {
            host: process.env.DATABASE_URL,
            ssl: true
        },
    });

export default knexInstance