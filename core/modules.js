/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine'),
    lodash = require('lodash');

var Modules = function(){
    this.loaded_modules = {};
    this.loaded_system_modules = {};
};

Modules.prototype.LoadModules = function(){

    this.loaded_system_modules = lizard.importLocal(lizard.get('modules dir'), true);
    this.loaded_modules        = lizard.import(lizard.get('modules dir'), true);
};

/**
 * Set static public directory for express.js
 */

Modules.prototype.MappingPublic = function(){

    // System modules

    if(this.loaded_system_modules != null)
    {
        var dir = "";

        for(var key in this.loaded_system_modules)
        {
            this.loaded_system_modules[key].isSystem = true;

            if(this.loaded_system_modules.hasOwnProperty(key) && this.loaded_system_modules[key].hasOwnProperty(lizard.get('static dir')))
            {
                dir = lizard.get('engine dir')+"/"+lizard.get('modules dir')+"/"+key+"/"+lizard.get('static dir');
                lizard.Application.setPublic(dir, "/"+lizard.get('static dir')+'/'+key);
            }
        }
    }

    // Local project modules

    if(this.loaded_modules != null)
    {
        var dir = "";

        for(var key in this.loaded_modules)
        {
            this.loaded_modules[key].isSystem = false;

            if(this.loaded_modules.hasOwnProperty(key) && this.loaded_modules[key].hasOwnProperty(lizard.get('static dir')))
            {
                dir = lizard.get('project dir')+"/"+lizard.get('modules dir')+"/"+key+"/"+lizard.get('static dir');
                lizard.Application.setPublic(dir, "/"+lizard.get('static dir')+'/'+key);
            }
        }
    }

};

/**
 * Return module object
 *
 * @param _module module name
 * @returns Object
 */

Modules.prototype.Module = function(_module)
{
    if(_module === undefined){
        return null;
    }

    if(this.loaded_modules.hasOwnProperty(_module))
    {
        return this.loaded_modules[_module];
    }

    if(this.loaded_system_modules.hasOwnProperty(_module))
    {
        return this.loaded_system_modules[_module];
    }

    return null;
};

/**
 * Return model instance
 *
 * @param module_name Module name
 * @param model Model name
 * @returns Model instance
 */

Modules.prototype.Model = function(module_name, model){

    if(model === undefined){
        return null;
    }

    var _module = this.Module(module_name);

    if(_module !== null && _module.hasOwnProperty(lizard.get('models dir')))
    {
        if(!_module.hasOwnProperty('model_instance'))
        {
            _module['model_instance'] = {};
        }

        if(_module['model_instance'].hasOwnProperty(model))
        {
            return _module['model_instance'][model];
        }

        var controller = lizard.Utils.GetByPath(model, _module[lizard.get('models dir')]);

        if(controller !== null)
        {
            _module['model_instance'][model] = new controller();
            return _module['model_instance'][model];
        }
    }

    return null;
};

/**
 * Return module component
 *
 * @param module_name Module name
 * @param component Component name
 * @returns Component class
 */

Modules.prototype.Component = function(module_name, component){

    if(component === undefined){
        return null;
    }

    var _module = this.Module(module_name);
    component   = component.toLowerCase();

    if(_module !== null && _module.hasOwnProperty(lizard.get('component dir')))
    {
        var controller = lizard.Utils.GetByPath(component, _module[lizard.get('component dir')]);

        if(controller !== null)
        {
            return controller;
        }
    }

    return null;
};

/**
 * Return module controller
 *
 * @param module_name Module name
 * @param controller Controller name
 * @returns Controller class
 */

Modules.prototype.Controller = function(module_name, controller){

    if(controller === undefined){
        return null;
    }

    var _module = this.Module(module_name);
    controller  = controller.toLowerCase();

    if(_module !== null && _module.hasOwnProperty(lizard.get('controllers dir')))
    {
        var controller = lizard.Utils.GetByPath(controller, _module[lizard.get('controllers dir')]);

        if(controller !== null)
        {
            return controller;
        }
    }

    return null;
};

module.exports = new Modules();