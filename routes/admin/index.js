const express = require('express');
const faker = require('faker');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req,res) => {
    return res.render('admin/index');
});

router.post('/generate-fake-posts', (req, res) => {

    for (let i = 0; i < req.body.amount; i++) {
        let post = new Post({
            title: faker.name.title(),
            status: faker.random.arrayElement(['publico', 'draft', 'privado']),
            allowComments: Math.round(Math.random() + 1) % 2 === 0,
            body: faker.lorem.paragraph(),
        });

        post.save().then(createdPost => {
            console.log('Post created: ' + createdPost)
        }).catch(error => console.error(error));

    }

    return res.redirect('/admin/posts');

});


module.exports = router;