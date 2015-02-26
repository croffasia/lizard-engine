/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine');

module.exports = function(path, req, res, cb)
{
    var path_array = path.split(".");

    if(path_array != undefined && path_array.length > 1)
    {
        var module = path_array[0];
        path_array.shift();

        var action = path_array.join(".");
        var component = lizard.Modules.Component(module, action);

        if(component != null) component.call(this, req, res, cb);
    }
};