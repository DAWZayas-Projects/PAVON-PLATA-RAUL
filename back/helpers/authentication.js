module.exports = {
    userAuthenticated: function (req,res,next){
       if(req.isAuthenticated()){
           return next()
       }
       req.flash('error-message', 'Necesita estar conectado para poder acceder a esa ruta');
       res.redirect('/login');
    }
};