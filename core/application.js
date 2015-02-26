/**
 * Created by andriipoluosmak on 25.02.15.
 */
var lizard = require('lizard-engine'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session = require('express-session');

var Application = function(){};

var express = require('express');

Application.prototype.init = function(configureCallback){
    this.app = express();
    this.server = null;

    if (process.env.NODE_ENV == "dev")
        this.app.use(logger('dev'));

    this.app.use(express.static(lizard.get('project dir') + '/'+lizard.get('static dir')));
    this.app.use(session({secret: lizard.get('cookies secret'), saveUninitialized: true, resave: true}));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    if(typeof configureCallback === "function")
    {
        configureCallback(this);
    }
};

Application.prototype.start = function()
{
    var context = this;
    this.server = this.app.listen(process.env.PORT || lizard.get('port'), function(){

        console.log('Lizard Web Application listening at 127.0.0.1:%s', lizard.get('port'))
    });
}

module.exports = new Application();
