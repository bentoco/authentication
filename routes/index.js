const express = require('express');
const router = express.Router();
const userApi = require('../api/user-api')

router
.route('/')
.post(userApi.updateDataUser)

router
.route('/profile')
.get(userApi.userAfterRegistred)

router
.route('/logout')
.get(userApi.userLogout)

module.exports = router;


