const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");

const path = require("path");

const Jimp = require("jimp");

const fs = require("fs/promises");

const { User } = require("../models/user.model");

const {HttpError, ctrlWrapper} = require("../helpers")

const { SECRET_KEY } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email is already in use")
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL});
    
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: "starter",
        },
        
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email address or password is invalid")
    }
    const passwordCompare = await bcryptjs.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email address or password is invalid");
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "24h"});
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: "starter",
        },
    });
}

const getCurrent = async (req, res) => {
    const { email} = req.user;

    res.json({
        email,
        subscription: "starter",
        
    });
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({
        message: "Logout is success"
    })
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;

    const { path: tempUpload, originalname } = req.file;

    const avatar = await Jimp.read(tempUpload);
    avatar.resize(250, 250).writeAsync(tempUpload);
    
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL,
    })
}
module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}