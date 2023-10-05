const signupRoute = (knexInstance, bcrypt) => (req, res) => {
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
            res.status(400).send('some error`s happened')
        })
}

export default signupRoute