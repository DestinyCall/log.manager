const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const morgan = require('morgan');
const ejs = require('ejs');
const path = require('path');

const winston = require('./config/winston');

const app = express();
const port = 3000;


app.use(morgan('combined', { stream: winston.stream }));

app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));

app.use(express.json());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res,next) => {
  winston.log('info','Log Servcie');
  res.json({msg:'Logging Service'});
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // add this line to include winston logging
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

app.listen(port, () => console.log(`Log app listening on port ${port}!`))
