const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    company: [companySchema]
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

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User