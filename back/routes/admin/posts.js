const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const uploadsDir = './public/uploads/';
const fs = require('fs');
const path = require('path');
const moment = require('moment');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req,res) => {
  Post.find({})
    .populate('category')
    .populate('author')
    .then(posts => {
    return res.render('admin/posts', {posts});
  }).catch(error => console.error(error));
});

router.get('/create', (req, res) => {
    Category.find({}).then(categories => {
        res.render('admin/posts/create', {categories});
    }).catch(err=> {
        console.error(err)
    });
});

router.post('/create', (req, res) => {
    let errors = [];
    if(!req.body.title || !req.body.title.trim().length){
        errors.push( {message: 'Por favor, añada un título'});
    }
    if(!req.body.body || !req.body.body.trim().length) {
        errors.push({message: 'Por favor, añada una descripción para su post'})
    }
    if(errors.length) {
       return res.render('admin/posts/create', {errors});
    }

    let fileName = 'placeholder.PNG';
    if(!isEmpty(req.files)) {
        let file = req.files.file;
        fileName = Date.now()+'-'+file.name;
        file.mv( uploadsDir + fileName, err => {
            if (err) console.error(err);
        });
    }

   const newPost = new Post({
       author: req.user._id,
       category: req.body.category,
       title: req.body.title,
       status: req.body.status,
       allowComments: !!req.body.allowComments,
       body: req.body.body,
       file: fileName,
       date: moment().format('HH:mm:ss DD/MMMM/YYYY')
   });

   newPost.save().then(savedPost => {
       console.log('Post saved: ' + savedPost);
       req.flash('success-message', 'Post con título \''+ savedPost.title + '\' creado correctamente');
       res.redirect('/admin/posts');
   }).catch(error => {
       req.flash('error-message', 'No se pudo crear el post');
       console.error(error);
   })

});

router.get('/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).populate('category').then(post => {
        Category.find({}).then(categories => {
            res.render('admin/posts/edit', {post, categories});
        }).catch(error => console.error(error));
    }).catch(error => console.error(error));
});

router.put('/edit/:id', (req, res) => {
    Post.findById(req.params.id).then(post => {
        let fileName = '';
        if(!isEmpty(req.files)) {
                let file = req.files.file;
                fileName = Date.now()+'-'+file.name;
                file.mv( uploadsDir + fileName, err => {
                    if (err) console.error(err);
                })
        }
        post.set({
            author: post.author,
            category: req.body.category,
            title: req.body.title,
            file: fileName || post.file,
            status: req.body.status,
            allowComments: !!req.body.allowComments,
            body: req.body.body,
            date: moment().format('HH:mm:ss DD/MMMM/YYYY')
        });
        post.save()
            .then(editedPost => {
            req.flash('success-message', `Post con Id ${editedPost._id} editado correctamente`);
            res.redirect('/admin/posts');
        })
            .catch(error => {
            req.flash('error-message', 'No se pudo actualizar el post');
            console.error(error);
        })
    }).catch(error => {
        req.flash('error-message', 'No se pudo actualizar el post');
        console.error(error);
    })
});

router.delete('/:id', (req, res) => {
    Post.findById(req.params.id)
	    .populate('comments')
      .then(post => {
        Comment.find({post: post._id}).then( comments => {
          comments.forEach( comment => {
            comment.remove();
	        });
	        if(post.file !== 'placeholder.PNG'){
		        fs.unlink(uploadsDir + post.file, err => {
			        post.remove();
			        req.flash('success-message', `Post con Id '${post._id}' eliminado`);
			        res.redirect('/admin/posts');
		        });
	        }
	        else{
		        post.remove();
		        req.flash('success-message', `Post con Id '${post._id}' eliminado`);
		        res.redirect('/admin/posts');
	        }
        })
      }).catch(error => {
        req.flash('error-message', 'No se pudo borrar el post');
        console.error(error);
      })
});

module.exports = router;