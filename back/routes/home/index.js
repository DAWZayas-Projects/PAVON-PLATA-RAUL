const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();


const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({email: email})
        .then( user => {
            if(!user) return done(null, false, { message: 'No se encontró el usuario' });
            bcrypt.compare(password, user.password, (err, matched) =>{
                if (err) return done(err);
                if (matched) return done(null, user);
                return done(null, false, {message: 'Contraseña incorrecta'})

            })
        })
        .catch(error => {
          return done(error);
        });
}));

passport.serializeUser((user, done) =>{
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req,res) => {
    Post.find({}).populate('author').then(posts => {
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
    Post.find({category: req.params.id}).populate('author').then(posts => {
        Category.find({}).then(categories => {
            return res.render('home/index', {posts, categories});
        }).catch(err => {
            console.error(err)
        })

    }).catch(err => {
        console.error(err)
    })
});
router.get('/author', (req, res) => {
console.log(req.user);
	Post.find({author: req.user._id}).populate('author').populate('comments').then(posts => {
		Category.find({}).then(categories => {
			return res.render('home/index', {posts, categories});
		}).catch(err => {
			console.error(err)
		})
	}).catch(error => {
		console.error(error)
	})
});

router.get('/login', (req,res) => {
    return res.render('home/login');
});
router.post('/login', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next);
});
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success-message', 'Desconectado correctamente');
    res.redirect('/');
});
router.get('/register', (req,res) => {
    return res.render('home/register');
});
router.post('/register', (req,res) => {
    let errors = [];
    if(!req.body.firstName || !req.body.firstName.trim().length){
        errors.push( {message: 'Por favor, añada un nombre'});
    }
    if(!req.body.lastName || !req.body.lastName.trim().length) {
        errors.push({message: 'Por favor, añada un apellido'})
    }
    if(!req.body.email || !req.body.email.trim().length) {
        errors.push({message: 'Por favor, añada un email'})
    }
    if(!req.body.password || !req.body.password.trim().length) {
        errors.push({message: 'Por favor, añada una contraseña'})
    }
    if(!req.body.passwordConfirm || !req.body.passwordConfirm.trim().length) {
        errors.push({message: 'Por favor, confirme su contraseña'})
    }
    if(req.body.password.trim() !== req.body.passwordConfirm.trim()){
        errors.push({message: 'Las contraseñas no coinciden'})
    }
    User.find({email: req.body.email})
        .then(user => {
           if(user) errors.push({message: 'El email ya ha sido utilizado'});
           if(errors.length) {
               return res.render('home/register', {errors,
                   firstName: req.body.firstName,
                   lastName: req.body.las+tName,
                   email: req.body.email});
           }
        }).catch(error => {
        console.error(error);
    });


    bcrypt.genSalt(10, (err, salt) => {
       bcrypt.hash(req.body.password, salt, (err, hash) =>{
           const newUser = new User({
               firstName: req.body.firstName,
               lastName: req.body.lastName,
               email: req.body.email,
               password: hash
           });
           newUser.save()
               .then(savedUser => {
                   req.flash('success-message', `Usuario ${savedUser.firstName} registrado correctamente`);
                   res.redirect('/login');
               })
               .catch(error=>{
                   console.error(error);
                   req.flash('error-message','No se pudo registrar al usuario');
                   res.redirect('/register');
               });
       })
    });





});
router.get('/post/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).populate('author').populate({path: 'comments', populate: {path: 'user', model: 'users'}}).then(post => {
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