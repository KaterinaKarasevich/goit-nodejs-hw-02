const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");

const path = require("path");

const Jimp = require("jimp");

const fs = require("fs/promises");

const { nanoid } = require("nanoid/non-secure");

const { User } = require("../models/user.model");

const {HttpError, ctrlWrapper, sendEmail} = require("../helpers")

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email is already in use")
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken});

    const verifyEmail = {
       to: email,
       subject: "Verify email",
       html: `<a target="blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email </a>`,
  };

    await sendEmail(verifyEmail);
    
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: "starter",
        },
        
    });
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "USER not found");
    }
    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: ""
    });
    
    res.json({
        message: "Verification successful",
    });

};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email not found");
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed")
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="blank" href="${BASE_URL}api/auth/verify/${user.verificationToken}">Click to verify email </a>`,
    };
    await sendEmail(verifyEmail);
    res.json({
        message: "Verification email sent"
    });
};
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email address or password is invalid")
    }
    if (!user.verify) {
        throw HttpError(401, "Email not verified");
    }

    const passwordCompare = await bcryptjs.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email address or password is invalid");
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: "starter",
        },
    });
};

const getCurrent = async (req, res) => {
    const { email } = req.user;

    res.json({
        email,
        subscription: "starter",
        
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({
        message: "Logout is success"
    })
};

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
};
module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}