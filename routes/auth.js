// Import the functions from the controller
const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controllers/userController"); // Make sure this path is correct

// Import Express Router
const router = require("express").Router();

// Define the routes
router.post("/login", login); // POST request for login
router.post("/register", register); // POST request for registration
router.get("/allusers/:id", getAllUsers); // GET request for all users, excluding the current user
router.post("/setavatar/:id", setAvatar); // POST request for setting avatar
router.get("/logout/:id", logOut); // GET request for logout

// Export the router to use in the main server file
module.exports = router;
