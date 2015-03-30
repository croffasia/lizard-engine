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
    var localPlugins = lizard.import(lizard.get('plugins dir'), true);
    var systemPlugins = lizard.import( "node_modules"+path.sep+"lizard-engine"+path.sep+""+lizard.get('plugins dir'));

    this.loaded_plugins = _.extend(localPlugins, systemPlugins);
};

Plugins.prototype.Get = function(plugin)
{
    var controller = lizard.Utils.GetByPath(plugin, this.loaded_plugins);

    if(controller != null)
    {
        return controller;
    }

    return null;
};

Plugins.prototype.Run = function(context, plugin)
{
    var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];}

    var controller = lizard.Utils.GetByPath(plugin, this.loaded_plugins);

    if(controller != null)
    {
        var pluginArguments = Array.prototype.slice.call(args, 2);
        return controller.apply(context, pluginArguments);
    } else {
        return false;
    }
};

module.exports = new Plugins();