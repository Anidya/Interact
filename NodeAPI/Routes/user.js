const express = require('express');
const {userById, allUsers, getUser, updateUser, deleteUser, userPhoto, addFollowing, addFollowers, removeFollowing, removeFollowers} = require('../Controlers/user')
const {requireSignin} = require('../Controlers/auth');

const router= express.Router();
router.get('/users',allUsers);
router.get('/user/:userId',requireSignin,getUser);
router.put('/user/:userId',requireSignin,updateUser);
router.delete('/user/:userId',requireSignin,deleteUser);
router.get('/user/photo/:userId', userPhoto);
router.put('/user/follow', requireSignin, addFollowing, addFollowers); 
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollowers);

router.param("userId",userById)
module.exports = router 