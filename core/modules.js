/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine'),
    _ = require('underscore');

var Modules = function(){
    this.loaded_modules = {};
};

Modules.prototype.LoadModules = function(cb){

    var loaded_engine_modules = lizard.importLocal(lizard.get('modules dir'), true);
    var local_loaded_modules = lizard.import(lizard.get('modules dir'), true);

    this.loaded_modules = _.extend(local_loaded_modules, loaded_engine_modules);

    for(var key in this.loaded_modules)
    {
        delete this.loaded_modules[key][lizard.get('models dir')];
    }

    if(cb) cb();
    //console.log(require('util').inspect(this.loaded_modules));
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
                && this.loaded_modules[key]['info']['settings']['cp'] == true){

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

Modules.prototype.Module = function(_module)
{
    if(_module == undefined) return null;
    _module = _module.toLowerCase();

    if(_.has(this.loaded_modules, _module))
    {
        return this.loaded_modules[_module];
    }

    return null;
};

Modules.prototype.Info = function(_module)
{
    if(_module == undefined) return null;
    _module = _module.toLowerCase();

    if(_module != null && _.has(_module, "info"))
    {
        return _module['info'];
    }

    return null;
};

Modules.prototype.Model = function(module_name, model){

    if(model == undefined) return null;
    model = model.toLowerCase();

    if(_.has(lizard.models, model))
    {
        var controller = lizard.models[model];

        if(controller != null)
        {
            return controller;
        }
    }

    return null;
};

Modules.prototype.Component = function(module_name, component){

    if(component == undefined) return null;
    var _module = this.Module(module_name);

    component = component.toLowerCase();

    if(_module != null && _.has(_module, lizard.get('component dir')))
    {
        var controller = this.GetByPath(component, _module[lizard.get('component dir')]);

        if(controller != null)
        {
            return controller;
        }
    }

    return null;
};

Modules.prototype.Controller = function(module_name, controller){

    if(controller == undefined) return null;

    var _module = this.Module(module_name);

    controller = controller.toLowerCase();

    if(_module != null && _.has(_module, lizard.get('controllers dir')))
    {
        var controller = this.GetByPath(controller, _module[lizard.get('controllers dir')]);

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