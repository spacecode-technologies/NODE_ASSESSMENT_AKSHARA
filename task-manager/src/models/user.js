const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const addressSchema = new mongoose.Schema({
    state:{
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    pin: {
        type: Number,
        required: true,
        trim: true
    }
})

const companySchema = new mongoose.Schema({
    companyName:{
        type: String,
        required: true,
        trim: true
    },
    workEmail: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    workLocation: {
        type: String,
        required: true,
        trim: true
    },
    companySize: {
        type: String,
        required: true,
        trim: true
    },
    ats: {
        type: String,
        required: true,
        trim: true
    }
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    address: [addressSchema],
    company: [companySchema],
    tokens: [{
        token:{
            type: String,
            require: true
        }
    }]
    // age: {
    //     type: Number,
    //     default: 0,
    //     validate(value) {
    //         if (value < 0) {
    //             throw new Error('Age must be a postive number')
    //         }
    //     }
    // }
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismysecretkey')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async(email, password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//Hashing
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User