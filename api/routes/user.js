const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
//salting is adding some random string to the plaintextpassword and then hashing and storing the random strings in the hash

router.post('/signup', UserController.users_signup_user);

router.post('/login', UserController.users_login_user);


router.delete('/:userId', checkAuth, UserController.users_delete_user);



module.exports = router;
