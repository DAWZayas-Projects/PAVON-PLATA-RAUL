const express = require('express');
const path = require('path');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { mongoDbUrl } = require('./config/database');

const app = express();
const port = process.env.PORT || 4000;

const { select, formatDate } = require('./helpers/handlebars-helpers');
const {userAuthenticated} = require('./helpers/authentication');

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

mongoose.connect(mongoDbUrl)
    .then(db => {
        console.log('Connected to the dbserver');
    })
    .catch(err => {
        console.error('Could not connect to dbserver ' + err);
    });



app.engine('handlebars', expressHandlebars({defaultLayout: 'home', helpers: { select, formatDate }}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(upload(),bodyParser.json(), bodyParser.urlencoded({extended: true}), bodyParser.text(), bodyParser.raw(), methodOverride('_method'));

app.use(session({
    secret: 'EpicSaxGuy123',
    resave: true,
    saveUninitialized: true,
}), flash(), passport.initialize(), passport.session());


app.use((req,res, next) => {
   res.locals.user = req.user || null;
   res.locals.successMessage = req.flash('success-message');
   res.locals.errorMessage = req.flash('error-message');
   res.locals.error = req.flash('error');
   next();
});

app.use('/', home);
app.use('/admin', userAuthenticated);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});