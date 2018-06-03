const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { isEmpty } = require('../../helpers/upload-helper');
const uploadsDir = './public/uploads/';

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req,res) => {

    Post.find({}).then(posts => {
        return res.render('admin/posts', {posts});
    }).catch(error => console.error(error));

});


router.get('/create', (req, res) => {
    res.render('admin/posts/create');
});

router.post('/create', (req, res) => {
    let fileName = 'placeholder.PNG';
    if(!isEmpty(req.files)) {
        let file = req.files.file;
        fileName = Date.now()+'-'+file.name;
        file.mv( uploadsDir + fileName, err => {
            if (err) console.error(err);
        });
    }

   const newPost = new Post({
       title: req.body.title,
       status: req.body.status,
       allowComments: req.body.allowComments ? true : false,
       body: req.body.body,
       file: fileName
   });

   newPost.save().then(savedPost => {
       console.log('Post saved: ' + savedPost);
        res.redirect('/admin/posts');
   }).catch(error => {
       console.error(error);
   })

});

router.get('/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).then(post => {
        res.render('admin/posts/edit', {post});
    }).catch(error => console.error(error));
});

router.put('/edit/:id', (req, res) => {
    Post.findByIdAndUpdate(req.params.id, {$set: {title: req.body.title, status: req.body.status, allowComments: req.body.allowComments ? true : false, body: req.body.body}}, {new: true})
        .then(editedPost => {
        console.log('Post edited: ' + editedPost);
        res.redirect('/admin/posts');
    }).catch(error => {
        console.error(error);
    })
});

router.delete('/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(deletedPost => {
            console.log('Post removed: ' + deletedPost);
            res.redirect('/admin/posts');
        }).catch(error => {
        console.error(error);
    })
});

module.exports = router;