/**
 * Created by andriipoluosmak on 02.03.15.
 */
//


var lizard = require('lizard-engine'),
    validator = require('validator'),
    _ = require('underscore');

module.exports = function(req, res, options, render){

    var view = new lizard.View(req, res, module.id, lizard.get('engine dir'));
    var locals = view.locals;


    view.on('init', function(next){

        var url = req.url.split("/");

        locals.current_key = "";
        locals.current_sub_key = "";

        if(url.length > 1)
            locals.current_key = url[1];

        if(url.length > 2)
            locals.current_sub_key = url[2];

        console.log("current key: "+locals.current_key);

        locals.modules = lizard.Modules.GelModulesForControll();

        if(locals.modules != null)
        {
            find:
            for(var i = 0; i < locals.modules.length; i++)
            {
                if(_.has(locals.modules[i], 'cp'))
                {
                    for(var c = 0; c < locals.modules[i].control.length; c++) {
                        if (locals.current_key == locals.modules[i].control[c].key)
                        {
                            locals.current_category_label = locals.modules[i].control[c].label;
                            break find;
                        }
                    }
                }
            }
        }

        next();

    });

    view.render('components/breadcrumb.html', render);

};