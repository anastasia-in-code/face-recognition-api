const imageRoute = (knexInstance) => (req, res) => {
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
}

export default imageRoute