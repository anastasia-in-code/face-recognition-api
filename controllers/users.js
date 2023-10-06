const usersRoute = (knexInstance) => (req, res,) => {
    
    //query gets all existing users
    knexInstance.select('*').from('users')
        .then(users => res.json(users))
}

export default usersRoute