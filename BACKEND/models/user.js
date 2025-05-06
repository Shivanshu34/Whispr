import mongoose from 'mongoose';
import pkg from 'passport-local-mongoose';
import validator from "validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Enter a valid mail"],
        trim: true,
    },
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
}, {timestamps: true});

userSchema.plugin(pkg);

const User = mongoose.model("User", userSchema);
export default User;
