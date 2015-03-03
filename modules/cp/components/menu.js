/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    validator = require('validator'),
    _ = require('underscore');

module.exports = function(req, res, options, render){

    var view = new lizard.View(req, res, module.id);
    var locals = view.locals;

    view.on('init', function(next){

        var url = req.url.split("/");

        locals.current_key = "";
        locals.current_sub_key = "";

        if(url.length > 2)
            locals.current_key = url[2];

        if(url.length > 3)
            locals.current_sub_key = url[3];

        locals.modules = lizard.Modules.GelModulesForControll();

        next();

    });

    view.render('components/menu.html', render);

};