const express = require('express');
const path = require('path');
const expressHandlebars = require('express-handlebars');

const app = express();
const port = process.env.PORT || 4000;


app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', expressHandlebars({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

app.get('/', (req,res) => {
   return res.render('home/index');
});

app.get('/about', (req,res) => {
    return res.render('home/about');
});

app.get('/login', (req,res) => {
    return res.render('home/login');
});

app.get('/register', (req,res) => {
    return res.render('home/register');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});