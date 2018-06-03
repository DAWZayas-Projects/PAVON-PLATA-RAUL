const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req,res) => {
    return res.render('home/index');
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


module.exports = router;