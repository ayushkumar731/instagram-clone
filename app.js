const express = require('express');
const path = require('path');
const app = express();
const db = require('./config/mongoose');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./config/AppError');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');

const session = require('express-session');
const passport = require('passport');
const jwtPassport = require('./config/passport-jwt-strategy');

const sassMiddleware = require('node-sass-middleware');

app.enable('trust proxy');

if (process.env.NODE_ENV !== 'production') {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, 'assets', 'scss'),
      dest: path.join(__dirname, 'assets', 'css'),
      debug: true,
      outputStyle: 'extended',
      prefix: '/css',
    })
  );
}

//setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//cors apply
app.use(cors());
app.options('*', cors());

//to serve the static files
app.use(express.static(path.join(__dirname, 'assets')));

//body-parser to read the body with req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressLayouts);
//extract style and scripts from sub page of the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(passport.initialize());
app.use(passport.session());

app.use(compression());

app.use('/', require('./routes'));

app.use(globalErrorHandler);

module.exports = app;
