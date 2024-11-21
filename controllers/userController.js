const bcrypt = require("bcrypt");
const User = require("../models/userModel"); // Ensure the correct path to the model

// Register User
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const userObject = user.toObject(); // Convert to plain object
    delete userObject.password;

    return res.json({ status: true, user: userObject });
  } catch (ex) {
    console.error("Error in register:", ex);
    next(ex);
  }
};

// Login User
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }

    const userObject = user.toObject(); // Convert to plain object
    delete userObject.password;

    return res.json({ status: true, user: userObject });
  } catch (ex) {
    console.error("Error in login:", ex);
    next(ex);
  }
};

// Set Avatar Image
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true } // Return the updated document
    );

    if (!userData) {
      return res.json({ msg: "User not found", status: false });
    }

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    console.error("Error in setAvatar:", ex);
    next(ex);
  }
};

// Get All Users (excluding the current user)
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users); // Correct usage of res.json()
  } catch (ex) {
    console.error("Error in getAllUsers:", ex);
    next(ex);
  }
};

// Logout User (You can implement logout functionality based on your needs)
module.exports.logOut = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Example: Destroy session or token for logout
    // For now, we'll just send a success message
    return res.json({ status: true, msg: "Logged out successfully!" });
  } catch (ex) {
    console.error("Error in logOut:", ex);
    next(ex);
  }
};
