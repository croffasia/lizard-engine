/**
 * Created by andriipoluosmak on 25.02.15.
 */

var lizard = require('lizard-engine'),
    async = require('async'),
    path = require('path'),
    regexp = require('node-regexp');

var View = function(_req, _res, _module){
    this.locals = {};
    this.res = _res;
    this.req = _req;
    this.module = _module;

    this.queueInit = [];
    this.queueAction = [];
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

            lizard.template_engine.render(currentTemplate, context.locals, function(render_error, render_content){

                context.ComponentsRunner(render_content, function(runableContent)
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

View.prototype.ComponentsRunner = function(content, cb){

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
            var tag = results[i];

            series.push(function(next){
                lizard.Plugins.Run(context, 'component', tag, context.req, context.res, function(plugin_content){
                    replacedContent = replacedContent.replace("[["+tag+"]]", plugin_content);
                    next(null, replacedContent);
                });
            });
        }

        async.series(series, function(err, result){
            cb(replacedContent);
        });
    } else {
        cb(replacedContent);
    }

    //console.log(require('util').inspect(res));
    //console.log(require('util').inspect(myArray));
};

module.exports = View;