const signupRoute = (knexInstance, bcrypt) => (req, res) => {
    const { name, email, password } = req.body

    //email, name, and password verification
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }

    //hash password before store
    var hash = bcrypt.hashSync(password, 8);

    //transaction saves user data
    knexInstance
        .transaction(trx => {
            trx
                .insert({
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
                        .then(user => res.json(user[0]))
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json('some error`s happened')
        })
}

export default signupRoute