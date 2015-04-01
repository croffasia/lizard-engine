/**
 * Created by andriipoluosmak on 25.02.15.
 */

var lizard = require('lizard-engine');
var _ = require('lodash');

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

    context.ApplyMapping("/", lizard.get('main controller'));

    if(modules != null)
    {
        var system_auto_map = {};

        for(var key in modules)
        {
            // Generate Routing Mapping from routing.json
            if(modules[key].hasOwnProperty('routing'))
            {
                var modules_map = {};

                for(var map_key in modules[key]['routing'])
                {
                    if(modules[key]['routing'].hasOwnProperty(map_key))
                    {
                        modules_map[map_key] = key+"."+modules[key]['routing'][map_key];
                        context.ApplyMapping(map_key, key+"."+modules[key]['routing'][map_key]);
                    }
                }

                this.routes_map = _.merge(this.routes_map, modules_map);
            }
        }
    }
}

Routing.prototype.ApplyMapping = function(rules, action) {

    var actionExplode = action.split(".");

    if(actionExplode.length > 1)
    {
        var moduleName = actionExplode[0];
        actionExplode.shift();

        var controllerPath = actionExplode.join(".");
        var controller     = lizard.Modules.Controller(moduleName, controllerPath);

        if(controller !== null)
        {
            lizard.Application.app.all(rules, controller);
        }
    }
}

function module_exists( name ) {
    try {
        return require.resolve( name )
    } catch( e ) {
        return false
    };
}

module.exports = new Routing();