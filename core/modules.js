/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine'),
    _ = require('underscore');

var Modules = function(){
    this.loaded_modules = {};
};

Modules.prototype.LoadModules = function(){
    this.loaded_modules = lizard.import(lizard.get('modules dir'));

    console.log(require('util').inspect(this.loaded_modules));
};

Modules.prototype.GelModulesForControll = function(){

    var results = [];

    if(this.loaded_modules != undefined)
    {
        for(var key in this.loaded_modules)
        {
            if (_.has(this.loaded_modules[key], 'info')
                && _.has(this.loaded_modules[key]['info'], 'settings')
                && _.has(this.loaded_modules[key]['info']['settings'], 'cp')
                && _.has(this.loaded_modules[key]['info']['settings']['cp'] == true)){

                results.push(this.loaded_modules[key]['info']);
            }
        }
    }

    return results;
};

Modules.prototype.isControllPanel = function(module_name)
{
    var module = this.Module(module_name);

    if(module != null &&
        _.has(module, lizard.get('controllers dir'))
        && _.has(module[lizard.get('controllers dir')], 'cp'))
    {
        return true;
    }

    return false;
};

Modules.prototype.Module = function(module)
{
    if(_.has(this.loaded_modules, module))
    {
        return this.loaded_modules[module];
    }

    return null;
};

Modules.prototype.Info = function(module)
{
    if(_.has(this.loaded_modules, module) && _.has(this.loaded_modules[module], "info"))
    {
        return this.loaded_modules[module]['info'];
    }

    return null;
};

Modules.prototype.Model = function(module_name, model){

    var module = this.Module(module_name);

    if(module != null && _.has(module, lizard.get('models dir')))
    {
        var controller = this.GetByPath(model, module[lizard.get('models dir')]);

        if(controller != null)
        {
            return controller;
        }
    }

    return null;
};

Modules.prototype.Component = function(module_name, component){

    var module = this.Module(module_name);

    if(module != null && _.has(module, lizard.get('component dir')))
    {
        var controller = this.GetByPath(component, module[lizard.get('component dir')]);

        if(controller != null)
        {
            return controller;
        }
    }

    return null;
};

Modules.prototype.Controller = function(module_name, controller){

    var module = this.Module(module_name);

    if(module != null && _.has(module, lizard.get('controllers dir')))
    {
        var controller = this.GetByPath(controller, module[lizard.get('controllers dir')]);

        if(controller != null)
        {
            return controller;
        }
    }

    return null;
};

Modules.prototype.GetByPath = function(path, find){

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

module.exports = new Modules();