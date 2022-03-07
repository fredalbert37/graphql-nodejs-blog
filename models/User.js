const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Provide a valid email address'
        ]
    },
    displayName: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


module.exports = model("User", userSchema)