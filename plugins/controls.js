/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine');

module.exports = function(module_selected, controller_selected)
{
    var modules_extend = lizard.Modules.GelModulesForControll();
    var result = { module: "", controller: "", name: "" };

    if(modules_extend != null)
    {
        find:
            for(var i = 0; i < modules_extend.length; i++)
            {
                if(modules_extend[i].cp != undefined)
                {
                    for(var c = 0; c < modules_extend[i].cp.length; c++) {

                        if (module_selected === modules_extend[i].cp[c].route)
                        {
                            result.module = modules_extend[i].cp[c];
                            result.name = modules_extend[i].id;

                            if(modules_extend[i].cp[c].items && modules_extend[i].cp[c].items.length > 0)
                            {
                                for(var it = 0; it < modules_extend[i].cp[c].items.length; it++)
                                {
                                    if (controller_selected == modules_extend[i].cp[c].items[it].route)
                                    {
                                        result.controller = modules_extend[i].cp[c].items[it];
                                        break find;
                                    }
                                }
                            }

                            break find;
                        }
                    }
                }
            }
    }

    return result;
};