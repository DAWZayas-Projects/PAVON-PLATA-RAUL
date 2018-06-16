const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Category.find({user: req.user.id}).then(categories => {
        return res.render('admin/categories/index', {categories})
    }).catch(error => {
        console.error(error);
        return res.render('admin/categories/index');
    });
});

router.get('/:id', (req, res) => {
   Category.findById(req.params.id).then(category => {
        return res.render('admin/categories/edit', {category})
   }).catch(error => {
       req.flash('error-message', 'No se encontró la categoría');
       return res.redirect('/admin/categories')
   })
});

router.put('/:id', (req, res) =>{
    Category.findByIdAndUpdate({_id: req.params.id}, {$set: {name: req.body.name}}, {new: true}).then(category => {
        req.flash('success-message', `Categoría ${category.name} actualizada`);
        return res.redirect('/admin/categories');
    }).catch(error =>{
        req.flash('success-message', `No se pudo actualizar la categoría`);
        return res.redirect('/admin/categories');
    })
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove({_id: req.params.id}).then( removedCategory =>{
        req.flash('success-message', `Categoría ${removedCategory.name} eliminada`);
        return res.redirect('/admin/categories');
    }).catch(error =>{
        req.flash('success-message', `No se pudo eliminar la categoría`);
        return res.redirect('/admin/categories');
    })
});
router.post('/create', (req, res) => {
    const category = new Category({
        name: req.body.name
    });
    category.save().then(savedCategory => {
        req.flash('success-message', `Categoría ${savedCategory.name} creada`);
        return res.redirect('/admin/categories');
    }).catch(error => {
        req.flash('error-message', 'No se pudo crear la categoría');
        console.error(error);

        return res.redirect('/admin/categories');
    })
});

module.exports = router;