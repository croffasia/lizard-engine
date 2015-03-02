/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    validator = require('validator'),
    _ = require('underscore');

module.exports = function(req, res){

    console.log(require('util').inspect(req.url));
    var request_array = req.url.split("/");

    if(request_array && request_array.length > 1) {
        if (request_array.length > 2) {
            var url_module = request_array[1];
            var module = lizard.Modules.Module(url_module);

            if(module != null)
            {

            }
        }
    }

    res.send("1");
    return res.end();

    if (lizard.Plugins.Run(this, 'auth.check', req, res) == false)
        return res.redirect("/cp/login");

    var view = new lizard.View(req, res, module.id, lizard.get('engine dir'));
    var locals = view.locals;

    locals.title = "Dashboard";

    view.on('init', function(next){
        next();
    });

    view.render('index.html');

};