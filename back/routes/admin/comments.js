const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req,res) => {
	Comment.find({user: req.user._id}).populate('user').then(comments => {
		res.render(`admin/comments`, {comments});
	})
});

router.post('/', (req, res) => {
    Post.findById({_id: req.body.postId})
    .then(post => {
      const newComment = new Comment({
        user: req.user.id,
        body: req.body.body
      });
      post.comments.push(newComment);
      post.save().then(savedPost => {
        newComment.save().then(savedComment => {
          req.flash('success-message', 'Comentario añadido.');
          res.redirect(`/post/${savedPost._id}`);
        })
      })
    })
    .catch(err => {
      console.error(err)
		})
});

router.delete('/:id', (req, res) =>{
	Comment.findByIdAndRemove({_id: req.params.id}).then( deletedComment => {
		req.flash('success-message', '¡Comentario eliminado!');
		res.redirect('/admin/comments');
	}).catch(err => {
		req.flash('error-message', 'No se pudo eliminar el comentario');
		res.redirect('/admin/comments');
	})
});

module.exports = router;