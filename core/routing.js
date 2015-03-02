/**
 * Created by andriipoluosmak on 25.02.15.
 */

var lizard = require('lizard-engine');
var _ = require('underscore');

var Routing = function(){
    this.routes_map = {};
};

/**
 * Initialize routing map
 */
Routing.prototype.initialize = function(){
    this.routes_map["/"] = lizard.get('main controller');
    this.Mapping();
};

/**
 * Auto mapping routes for Control panel and routing settings in modules
 * @constructor
 */
Routing.prototype.Mapping = function(){
    var modules = lizard.Modules.loaded_modules;
    var context = this;

    //console.log(require('util').inspect(lizard.Modules.Module('cp')));
    //var router = lizard.express.app.Router();
    lizard.express.app.all('/cp', lizard.Modules.Module('cp').controllers.index);
    lizard.express.app.all('/cp/*', lizard.Modules.Module('cp').controllers.index);

    if(modules != null)
    {
        var system_auto_map = {};

        for(var key in modules)
        {
            // Generate Controll Panel Routes

            /*if(_.has(modules[key], lizard.get('controllers dir')) && _.has(modules[key][lizard.get('controllers dir')], 'cp'))
            {
                var BuildRoutesMap = function(object, current_path, current_path_runner){

                    for(var controller_key in object)
                    {
                        if(typeof object[controller_key] === "function")
                        {
                            system_auto_map[current_path+"/"+controller_key] = current_path_runner + "."+controller_key;
                            context.ApplyMapping(current_path+"/"+controller_key, current_path_runner + "."+controller_key);

                        } else if(typeof object[controller_key] === "object") {
                            BuildRoutesMap(object[controller_key], current_path+"/"+controller_key, current_path_runner+"."+controller_key);
                        }
                    }
                };

                BuildRoutesMap(modules[key][lizard.get('controllers dir')]['cp'], "/cp/"+key, key+".cp");
            }*/

            /*if(_.has(modules[key], 'info') && _.has(modules[key].info, 'settings')
                && _.has(modules[key].info.settings, 'cp') && modules[key].info.settings.cp == true)
            {
                if(_.has(modules[key].info, 'cp') && _.has(modules[key].info, 'settings')
                    && _.has(modules[key].info.settings, 'cp') && modules[key].info.settings.cp == true) {
                    var BuildRoutesMap = function (object, current_path, current_path_runner) {

                        for (var controller_key in object) {
                            if (typeof object[controller_key] === "function") {
                                system_auto_map[current_path + "/" + controller_key] = current_path_runner + "." + controller_key;
                                context.ApplyMapping(current_path + "/" + controller_key, current_path_runner + "." + controller_key);

                            } else if (typeof object[controller_key] === "object") {
                                BuildRoutesMap(object[controller_key], current_path + "/" + controller_key, current_path_runner + "." + controller_key);
                            }
                        }
                    };

                    BuildRoutesMap(modules[key][lizard.get('controllers dir')]['cp'], "/cp/" + key, key + ".cp");
                }
            }*/

            // Generate Routing Mapping from routing.json

            if(_.has(modules[key], 'routing'))
            {
                var modules_map = {};

                for(var map_key in modules[key]['routing'])
                {
                    modules_map[map_key] = key+"."+modules[key]['routing'][map_key];
                    context.ApplyMapping(map_key, key+"."+modules[key]['routing'][map_key]);
                }

                this.routes_map = _.extend(this.routes_map, modules_map);
            }
        }

        this.routes_map = _.extend(this.routes_map, system_auto_map);
    }
}

Routing.prototype.ApplyMapping = function(rules, action) {

    var actionExplode = action.split(".");
    if(actionExplode.length > 1)
    {
        var moduleName = actionExplode[0];
        actionExplode.shift();

        var controllerPath = actionExplode.join(".");
        var controller = lizard.Modules.Controller(moduleName, controllerPath);

        if(controller != null)
        {
            lizard.express.app.all(rules, controller);
        }
    }
}

Routing.prototype.GetControllerByPath = function(path, find){

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

function module_exists( name ) {
    try { return require.resolve( name ) }
    catch( e ) { return false }
}

module.exports = new Routing();