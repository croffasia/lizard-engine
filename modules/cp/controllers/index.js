/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    validator = require('validator'),
    _ = require('underscore');

var _LOGIN_URL = "/cp/login";

module.exports = function(req, res){

    if (lizard.Plugins.Run(this, 'auth.check', req, res) == false)
        return res.redirect(_LOGIN_URL);

    var view = new lizard.View(req, res, module.id);
    var locals = view.locals;

    locals.title = "Dashboard";

    view.on('init', function(next){

        var url = req.url.split("/");

        var current_key = "";
        var current_sub_key = "";

        if(url.length > 2)
            current_key = url[2];

        if(url.length > 3)
            current_sub_key = url[3];

        var findAction = lizard.Plugins.Run(null, 'controls', current_key, current_sub_key);
        var routing = "";

        if(findAction.controller != "")
        {
            var controller = lizard.Modules.Controller(findAction.name, findAction.controller.component);
            if(controller != null)
            {
                controller.call(null, req, res, function(result_content){
                    locals.cp_body_content = result_content;
                    next();
                });
            } else {
                next();
            }
        } else {
            var controller = lizard.Modules.Controller(findAction.name, findAction.module.component);
            if(controller != null)
            {
                controller.call(null, req, res, function(result_content){
                    locals.cp_body_content = result_content;
                    next();
                });
            } else {
                next();
            }
        }

    });

    view.render('index.html');

};