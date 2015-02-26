/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine'),
    _ = require('underscore'),
    path = require('path');

var Plugins = function(){
    this.loaded_plugins = {};
};

Plugins.prototype.LoadPlugins = function(){
    var localPlugins = lizard.import(lizard.get('plugins dir'));
    var systemPlugins = lizard.import( "node_modules"+path.sep+"lizard-engine"+path.sep+""+lizard.get('plugins dir'));

    this.loaded_plugins = _.extend(localPlugins, systemPlugins);
};

Plugins.prototype.Get = function(plugin)
{
    var controller = this.GetByPath(plugin, this.loaded_plugins);

    if(controller != null)
    {
        return controller;
    }

    return null;
};

Plugins.prototype.Run = function(context, plugin)
{
    var controller = this.GetByPath(plugin, this.loaded_plugins);

    if(controller != null)
    {
        var pluginArguments = Array.prototype.slice.call(arguments, 2);
        controller.apply(context, pluginArguments);
    }
};

Plugins.prototype.GetByPath = function(path, find){

    var explode = path.split(".");

    for(var i = 0; i < explode.length; i++)
    {
        if(_.has(find, explode[i]) && typeof find[explode[i]] === "function")
        {
            return find[explode[i]];
        } else if(_.has(find, explode[i]) && find[explode[i]] instanceof Object) {
            find = find[explode[i]];
        } else {
            return null;
        }
    }

    return null;
};

module.exports = new Plugins();