/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    validator = require('validator'),
    _ = require('underscore'),
    crypt = require('crypto-js');

module.exports = function(req, res, render){

    var view = new lizard.View(req, res, module.id);

    view.render('dashboard.html', render);

};