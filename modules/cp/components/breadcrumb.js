/**
 * Created by andriipoluosmak on 02.03.15.
 */
//


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

        locals.current_category_label = "";
        locals.current_subcategory_label = "";

        if(url.length > 2)
            locals.current_key = url[2];

        if(url.length > 3)
            locals.current_sub_key = url[3];

        locals.modules = lizard.Modules.GelModulesForControll();
        var findAction = lizard.Plugins.Run(null, 'controls', locals.current_key, locals.current_sub_key);

        locals.current_category_label = findAction.module.label;
        locals.current_subcategory_label = (findAction.controller.label!=undefined)?findAction.controller.label:"";

        next();

    });

    view.render('components/breadcrumb.html', render);

};