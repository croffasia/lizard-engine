/**
 * Created by andriipoluosmak on 25.02.15.
 */

var lizard = require('lizard-engine');
var lodash = require('lodash');

var Routing = function(){};

/**
 * Initialize routing map
 */
Routing.prototype.initialize = function()
{
    this.global_routing = lizard.importFile('routing.json');
    this.Mapping();

    if(this.global_routing != null){
        this.MappingGlobalRouting();
    }
};

/**
 * Mapping override routing
 * @constructor
 */
Routing.prototype.MappingGlobalRouting = function(){

    for(var key in this.global_routing)
    {
        if(this.global_routing.hasOwnProperty(key))
        {
            this.ApplyMapping(key, this.global_routing[key]);
        }
    }
};

/**
 * Auto mapping routes for Control panel and routing settings in modules
 * @constructor
 */
Routing.prototype.Mapping = function(){
    var modules = lizard.Modules.loaded_modules;

    this.ApplyMapping("/", lizard.get('main controller'));

    if(modules != null)
    {
        var system_auto_map = {};
        var isSystem = false;

        for(var key in modules)
        {
            if(modules[key].hasOwnProperty('isSystem')){
                isSystem = true;
            } else {
                isSystem = false;
            }

            // Skip for oweride global routing for project modules
            if(this.global_routing != null && isSystem == false){
                continue;
            }

            // Generate Routing Mapping from routing.json
            if(modules[key].hasOwnProperty('routing'))
            {
                for(var map_key in modules[key]['routing'])
                {
                    if(modules[key]['routing'].hasOwnProperty(map_key))
                    {
                        var route = modules[key]['routing'][map_key];

                        if(route.indexOf(":") > -1){
                            route = route.split(":")[0] + ":" + key + "." + route.split(":")[1];
                        } else {
                            route = key+"."+route;
                        }

                        this.ApplyMapping(map_key, route);
                    }
                }
            }
        }
    }
}

Routing.prototype.ApplyMapping = function(rules, action) {

    var routingType = 'get';
    var validTypes = ['get', 'post', 'put', 'all', 'delete'];

    if(action.indexOf(':'))
    {
        routingType = action.split(':')[0];

        if(validTypes.indexOf(routingType) == -1){
            routingType = "get";
        } else {
            action = action.split(':')[1];
        }
    }

    var actionExplode = action.split(".");

    if(actionExplode.length > 1)
    {
        var moduleName = actionExplode[0];
        actionExplode.shift();

        var controllerPath = actionExplode.join(".");
        var controller     = lizard.Modules.Controller(moduleName, controllerPath);

        if(controller !== null)
        {
            lizard.Application.app[routingType].call(lizard.Application.app, rules, controller);
        }
    }
}

module.exports = new Routing();