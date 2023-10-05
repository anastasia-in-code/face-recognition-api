const usersRoute = (knexInstance) => (req, res,) => {
    knexInstance.select('*').from('users')
        .then(users => res.json(users))
}

export default usersRoute