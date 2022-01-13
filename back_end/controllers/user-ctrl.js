const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../validation');
const { loginValidation } = require('../validation')

//creation d'un compte 
postRegister = async (req,res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist= await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashdPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashdPassword,
        age: req.body.age,
        famille: req.body.famille,
    })
    try{
        const savedUSer = await user.save()
        res.send({ user: user.id });
    }catch(err){
        res.status(400).send(err)
    }
}

//Connexion au compte
postLogin = async (req,res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
}

//recherche une personne par son nom
getUserByName = async (req, res) => {
    var id = req.params.id
    await User.findOne({ _id: id }, (err, user) => {
        if (err) {
            // console.log(req.params,'teeeest');
            return res.status(400).json({ success: false, error: err })
        } 
        if (!user) {
            return res.status(404).json({ success: false, error: `user not found` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

//recherche tout les membre de la db
getUser = async (req, res) => { 
    await User.find({}, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user.length) {

            return res.status(404).json({ success: false, error: `user not found` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

//modification d'un utilisateur
updateUser = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({ success: false, error: err })
    }
    User.findOne({ _id: req.params.id}, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        user.age = body.age
        user.famille = body.famille
        user.save()
        .then(() => {                                    
            res.status(200).send('User updated!');
        })
    })
    .catch(error => {
        res.status(400).send("unable to save to database");
    })
}

//exportations des fonctionnalité
module.exports = {
    postRegister,
    postLogin,
    getUser,
    getUserByName,
    updateUser
}