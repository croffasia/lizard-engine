/**
 * Created by andriipoluosmak on 25.02.15.
 */

var lizard = require('lizard-engine');
var _ = require('underscore');

var Routing = function(){
    this.routes_map = module_exists(lizard.get('project dir')+"/routing.json");
};

Routing.prototype.initialize = function(){

    if(this.routes_map != "") {
        this.Mapping();
    } else {
        throw Error();
    }
};

Routing.prototype.Mapping = function(){

    var routes_map = module_exists(lizard.get('project dir')+"/routing.json");

    if(routes_map != "")
    {
        routes_map = require(lizard.get('project dir')+"/routing.json");

        for(var key in routes_map) {

            var actionExplode = routes_map[key].split(".");
            if(actionExplode.length > 1)
            {
                var moduleName = actionExplode[0];
                actionExplode.shift();

                var controllerPath = actionExplode.join(".");
                var controller = lizard.Modules.Controller(moduleName, controllerPath);

                if(controller != null)
                {
                    lizard.express.app.all(key, controller);
                }
            }
        }
    }
};

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