/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    path = require('path');

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