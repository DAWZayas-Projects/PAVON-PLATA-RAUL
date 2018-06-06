const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req,res) => {
    Post.find({}).then(posts => {
        Category.find({}).then(categories => {
            return res.render('home/index', {posts, categories});
        }).catch(err => {
            console.error(err)
        })

    }).catch(err => {
        console.error(err)
    })


});
router.get('/category/:id', (req, res)=>{
    Post.find({category: req.params.id}).then(posts => {
        Category.find({}).then(categories => {
            return res.render('home/index', {posts, categories});
        }).catch(err => {
            console.error(err)
        })

    }).catch(err => {
        console.error(err)
    })
});
router.get('/about', (req,res) => {
    return res.render('home/about');
});

router.get('/login', (req,res) => {
    return res.render('home/login');
});

router.get('/register', (req,res) => {
    return res.render('home/register');
});

router.get('/post/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).then(post => {
        Category.find({}).then(categories => {
            return res.render('home/post', {post, categories});
        }).catch(err => {
            console.error(err)
        })
    }).catch(error => {
        console.error(error)
    })
});

module.exports = router;