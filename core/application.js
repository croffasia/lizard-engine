/**
 * Created by andriipoluosmak on 25.02.15.
 */
var lizard       = require('lizard-engine'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    compression  = require('compression');

var Application  = function(){};
var express      = require('express');

/**
 * Инициализация сервера
 * @param nextStep
 * @param configureCallback
 */

Application.prototype.init = function(nextStep)
{
    this.app    = express();
    this.server = null;

    if (process.env.NODE_ENV === "dev")
        this.app.use(logger('dev'));

    this.app.use(express.static(lizard.get('project dir') + '/'+lizard.get('static dir')));

    //this.app.set('trust proxy', 1);
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(session({
        secret: lizard.get('cookies secret'),
        resave: true,
        saveUninitialized: true
    }));

    this.app.use(require('connect-flash')());
    this.app.use(compression());

    this.app.use(function (req, res, next) {
        console.log(req.url);
        next();
    });

    if(lizard.get('application configure') != "" && typeof lizard.get('application configure') === "function")
    {
        lizard.get('application configure')(this.app, nextStep);
    } else {
        nextStep();
    }
};

/**
 * Установка кастомных паблик директорий
 * @param dir
 * @param url
 */
Application.prototype.setPublic = function(dir, url){

    if(url != undefined && url != "")
        this.app.use(url, express.static(dir));
    else
        this.app.use(express.static(dir));
};

/**
 * Старт сервера
 */
Application.prototype.start = function()
{
    this.app.use(function(req, res, next){
        res.status(404);

        if (req.accepts('html'))
        {
            var view = new lizard.View(req, res);
            view.locals.url = req.url;
            view.render('404.html');
            return;
        }

        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

        res.type('txt').send('Not found');
    });

    /*this.app.use(function(error, req, res, next){
        res.status(500);

        if (req.accepts('html'))
        {
            var view = new lizard.View(req, res);
            view.locals.url = req.url;
            view.render('500.html');
            return;
        }

        if (req.accepts('json')) {
            res.send({ error: 'Internal Server Error' });
            return;
        }

        res.type('txt').send('Internal Server Error');
    });*/

    this.server = this.app.listen(lizard.get('port'), function(){
        console.log('Lizard Web Application listening at 127.0.0.1:%s', lizard.get('port'))
    });
}

module.exports = new Application();
