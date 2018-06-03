const express = require('express');
const path = require('path');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 4000;

const { select } = require('./helpers/handlebars-helpers');

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

mongoose.connect('mongodb://localhost:27017/cms')
    .then(db => {
        console.log('Connected to the dbserver');
    })
    .catch(err => {
        console.error('Could not connect to dbserver ' + err);
    });



app.engine('handlebars', expressHandlebars({defaultLayout: 'home', helpers: { select }}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(upload());
app.use(bodyParser.json(), bodyParser.urlencoded({extended: true}), bodyParser.text(), bodyParser.raw());
app.use(methodOverride('_method'));

app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});