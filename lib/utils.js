/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    path = require('path'),
    util = require('util'),
    _    = require('underscore');

global.Inspect = function(object, pre){
    console.log(pre, util.inspect(object));
}

module.exports.GetModuleFromID = function(id)
{
    var dir = id.split(path.sep);
    if(dir && dir.length > 0)
    {
        i = dir.length - 1;
        var modulesDirName = lizard.get('modules dir');

        while(i > 1)
        {
            if(dir[i - 1] == modulesDirName)
            {
                return dir[i];
            }

            i--;
        }
    }

    return "";
};

module.exports.GetByPath = function(path, find){

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