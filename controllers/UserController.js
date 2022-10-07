const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const jwtSecret = process.env.JWT_SECRET

//GENERATE USER TOKEN
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    })
}

//register user and sign in
const register = async(req, res) => {
    
    const {nome, sobrenome, email, ano, sexo, tipoSangue, celular, local, senha} = req.body

    //check if user exists
    const user = await User.findOne({email})
    if(user){
        res.status(422).json({errors: ["E-mail já cadastrado"]})
        return
    }

    //generate password hash
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(senha, salt)

    //create user
    const newUser = await User.create({
        nome,
        sobrenome,
        email,
        ano,
        tipoSangue,
        celular, 
        local, 
        senha: passwordHash
    })
    console.log(newUser)

    //if user was created successfully, return token
    if(!newUser){
        res.status(422).json({errors: ["Houve um erro, por favor tente novamente"]})
        return
    }
    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })
    return
} 

//sign user login
const login = async (req, res) => {

    const {email, senha} = req.body

    const user = await User.findOne({email})

    //check if user exists
    if(!user){
        res.status(404).json({errors: ["Usuário não encontrado"]})
        return
    }
    //check is password matches
    if(!(await bcrypt.compare(senha, user.senha))){
        res.status(422).json({errors: ["Senha inválida"]})
        return
    }

    //return user with token
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    })
}

//get current logged in user
const getCurrentUser = async(req, res) => {
    const user = req.user
    res.status(200).json(user)
}

//update a an user
const update = async(req, res) => {
    console.log(req)
    const {nome, sobrenome, tipoSangue, celular, local, senha} = req.body
    let profileImage = null

    if(req.file){
        profileImage = req.file.filename
    }

    const reqUser = req.user
    const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select("-senha")

    if(nome){
        user.nome = nome;
    }
    if(sobrenome){
        user.sobrenome = sobrenome
    }
    if(tipoSangue){
        user.tipoSangue = tipoSangue
    }
    if(celular){
        user.celular = celular
    }
    if(local){
        user.local = local
    }
    if(senha){
        //generate password hash
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(senha, salt)

        user.senha = passwordHash
    }
    if(profileImage){
        user.profileImage = profileImage
    }

    await user.save()
    res.status(200).json(user)
}

//get user by id? maybe

module.exports = {
    register,
    login,
    getCurrentUser,
    update
}