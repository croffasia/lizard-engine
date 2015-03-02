/**
 * Created by andriipoluosmak on 25.02.15.
 */
var lizard = require('lizard-engine'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session = require('express-session'),
    //session = require('cookie-session'),
    compression = require('compression'),
    moment = require('moment');

var Application = function(){};

var express = require('express');

Application.prototype.init = function(configureCallback){
    this.app = express();
    this.server = null;

    if (process.env.NODE_ENV == "dev")
        this.app.use(logger('dev'));

    this.app.use(express.static(lizard.get('project dir') + '/'+lizard.get('static dir')));
    this.app.use('/public/cp', express.static(lizard.get('engine dir') + '/'+lizard.get('static dir')));

    //this.app.set('trust proxy', 1);
    this.app.use(cookieParser())
    //this.app.use(session({keys: [lizard.get('cookies secret')]}));

    this.app.use(session({
        secret: lizard.get('cookies secret'),
        resave: true,
        saveUninitialized: true
    }));

    this.app.use(require('connect-flash')());

    this.app.use(compression());

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(function (req, res, next) {
        //console.log(moment().format('MMMM Do, hh:mm:ss', ":"), req.url);
        next();
    });

    this.app.use(function (req, res, next) {
        //console.log(":::"+require('util').inspect(req.session));
        lizard.Plugins.Run(this, 'auth.get', req, function(result){
            res.locals.user = result;
            next();
        });
    });

    if(typeof configureCallback === "function")
    {
        configureCallback(this);
    }
};

Application.prototype.start = function()
{
    this.app.use(function(req, res, next){
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            //res.render('404', { url: req.url });
            var view = new lizard.View(req, res);
            view.locals.url = req.url;
            view.render('404.html');
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Not found');
    });

    var context = this;
    this.server = this.app.listen(process.env.PORT || lizard.get('port'), function(){

        console.log('Lizard Web Application listening at 127.0.0.1:%s', lizard.get('port'))
    });
}

module.exports = new Application();
