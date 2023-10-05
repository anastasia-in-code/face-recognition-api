const signinRoute = (knexInstance, bcrypt) => (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json('incorrect form submission')
    }

    knexInstance.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            if (isValid) {
                return knexInstance.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => res.json(user[0]))
                    .catch(err => res.status(400).json('some error`s happened'))
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
}

export default signinRoute