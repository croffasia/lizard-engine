/**
 * Created by andriipoluosmak on 25.02.15.
 */

var lizard = require('lizard-engine'),
    async = require('async'),
    path = require('path'),
    validator = require('validator'),
    _ = require('underscore');

var View = function(_req, _res, _module, root_template_dir){
    this.locals = {};
    this.res = _res;
    this.req = _req;
    this.module = _module;

    this.queueInit = [];
    this.queueAction = [];

    if(root_template_dir == undefined)
        root_template_dir = lizard.get('project dir')

    this.template_engine = require("../lib/templates/"+lizard.get('template engine'));
    this.template_engine.init(root_template_dir);
};

View.prototype.on = function()
{
    var action = arguments[0];
    var params = (arguments[1] instanceof Object)?arguments[1]:null;
    var cb = (typeof arguments[1] === "function")?arguments[1]:arguments[2];

    switch(action){

        case "init":

            this.queueInit.push(cb);

            break;

        case "post":
        case "get":
        case "params":

            this.queueAction.push({'action': action, 'params': params, callback: cb});

            break;
    }
};

function GetActionQuery(context){
    var newQuery = [];

    if(context.queueAction && context.queueAction.length > 0)
    {
        for(var i = 0; i < context.queueAction.length; i++)
        {
            if(context.queueAction[i].params != null)
            {
                var isAccess = true;

                for(var key in context.queueAction[i].params)
                {
                    switch(context.queueAction[i].action)
                    {
                        case "get":

                            if(context.req.query[key] == undefined
                                || context.req.query[key] !=  context.queueAction[i].params[key]){
                                isAccess = false;
                            }

                            break;

                        case "params":

                            if(context.req.params[key] == undefined
                                || context.req.params[key] !=  context.queueAction[i].params[key]){
                                isAccess = false;
                            }

                            break;

                        case "post":

                            if(context.req.body[key] == undefined
                                || context.req.body[key] !=  context.queueAction[i].params[key]){
                                isAccess = false;
                            }

                            break;
                    }

                    if(!isAccess) break;
                }

                if(isAccess){
                    newQuery.push(context.queueAction[i].callback);
                }
            }
        }
    }

    return newQuery;
};

function GetModuleFromID(id)
{
    var dir = id.split(path.sep);
    if(dir && dir.length > 0)
    {
        i = dir.length - 1;
        var modulesDirName = lizard.get('modules dir');

        while(i > 1)
        {
            if(dir[i - 1] == modulesDirName)
            {
                return dir[i];
            }

            i--;
        }
    }

    return "";
};

View.prototype.render = function(template, cb){

    var module = (this.module != undefined)?GetModuleFromID(this.module):"";
    var context = this;
    var allQuery = this.queueInit.concat(GetActionQuery(this));

    async.series(allQuery, function(error, results)
    {
        if(error == null)
        {
            var currentTemplate = lizard.get('template dir')+"/"+template;
            if(module != "")
            {
                context.locals.module_template_dir = lizard.get('modules dir')+"/"+module+"/"+lizard.get('template dir');
                currentTemplate = context.locals.module_template_dir + "/"+template;
            }

            context.locals.template_dir = lizard.get('template dir');

            var variables = _.extend(context.locals, context.res.locals);

            //console.log("VARIABLES:"+require('util').inspect(variables));

            context.template_engine.render(currentTemplate, variables, function(render_error, render_content){

                context.ExtendComponents(render_content, function(runableContent)
                {
                    if(cb != undefined && typeof cb === "function")
                    {
                        cb(runableContent);
                    } else {
                        context.res.set('Content-Type', 'text/html; charset=utf-8');
                        context.res.send(runableContent);
                        context.res.end();
                    }
                });
            });

        } else { if(cb == undefined) throw  Error("Error render"); else cb(""); }
    });
};

View.prototype.ExtendComponents = function(content, cb){

    var re = /\[\[(.*?)\]\]/g;
    var results = [];
    var replacedContent = content;

    while( res = re.exec(content) ) {
        results.push(res[1]);
    }

    var context = this;

    if(results.length > 0)
    {
        var series = [];
        for(var i = 0; i < results.length; i++)
        {
            var exp = results[i].split("|");
            var tag = validator.trim(exp[0]);
            var options = {};
            var tag_replaced = results[i];

            if(exp.length > 1)
                options = JSON.parse(validator.trim(exp[1]));

            var execution = function(_tag, _tag_replaced, _options)
            {
                var __tag = _tag;
                var __tag_replaced = _tag_replaced;
                var __options = _options;

                return function(next){
                    lizard.Plugins.Run(context, 'component', __tag, context.req, context.res, __options, function(plugin_content){
                        console.log("REPLACE "+__tag_replaced);
                        replacedContent = replacedContent.replace("[["+__tag_replaced+"]]", plugin_content);
                        next(null);
                    });
                };
            };

            series.push(execution(tag, tag_replaced, options));
        }

        async.series(series, function(err, result){
            cb(replacedContent);
        });
    } else {
        cb(replacedContent);
    }
};

module.exports = View;