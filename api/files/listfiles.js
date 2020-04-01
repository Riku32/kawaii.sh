module.exports = ({ db, app, config }) => {
    app.post('/api/files/list', async (req, res) => {
        const { token } = req.body
        const Users = db.collection('users')
        const Uploads = db.collection('uploads')

        const tokenExists = Boolean(await Users.findOne({ token }))
        if (tokenExists) {
            const { username } = await Users.findOne({ token })
            const { lockdown } = await Users.findOne({ username })
            if (lockdown) {
                res.status(400).send('Invalid token!')
            } else {
                const results = (
                    await Uploads.find({ username }).sort({_id:-1}).toArray()
                ).map( ({ file }) => file )

                res.status(200).json(results)
            }    
        } else {
            res.status(400).send('Invalid token!')
        }
    }
)}