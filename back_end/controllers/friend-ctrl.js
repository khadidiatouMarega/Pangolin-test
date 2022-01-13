const User = require('../models/user');

const addFriend = async (req, res) => {
    var requester = req.body.requester
    var recipient = req.body.recipient
    await User.findOneAndUpdate({ _id: requester }, { $addToSet: { friends: recipient } }, (error, user) => {
        return res.status(200).json({ success: true, data: user.friends })
    })
}

const deleteFriend = async (req, res) => {
    var requester = req.body.requester
    var recipient = req.body.recipient
    await User.update(
        { "_id": requester, "friends": recipient },
        { "$pull": { "friends": recipient } },
        { "multi": true },
        function (err, user) {
            return res.status(200).json({ success: true, data: user.friends })
        }
    )
}

const getFriend = async (req, res) => {
    var id = req.params.id
    await User.findOne({ _id: id }, (err, user) => {
        if (err) {
            // console.log(req.params,'teeeest');
            return res.status(400).json({ success: false, error: err })
        }
        if (!user) {
            return res.status(404).json({ success: false, error: `user not found` })
        }
        return res.status(200).json({ success: true, data: user.friends })
    }).catch(err => console.log(err))
}


//exportations des fonctionnalité
module.exports = {
    addFriend,
    deleteFriend,
    getFriend
}