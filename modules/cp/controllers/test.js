/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    validator = require('validator'),
    _ = require('underscore');

module.exports = function(req, res){

    var view = new lizard.View(req, res, module.id);
    view.locals.title = "Dashboard";

    view.render('index.html');

};