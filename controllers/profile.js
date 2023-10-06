const profileRoute = (knexInstance) => (req, res) => {
    const { id } = req.params

    //guery gets user's data
    knexInstance
        .select('*')
        .from('users')
        .where({ id })
        .then(result => {
            if (result.length) res.send(result[0])
            else res.status(400).send('not found')
        })
        .catch(err => res.status(400).send(err))
}

export default profileRoute