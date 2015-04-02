/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine');

module.exports = function(app)
{
    var middlewarePlugins = lizard.import(lizard.get('plugins dir') + "/" + "middleware");

    if(middlewarePlugins != null){
        for(var key in middlewarePlugins){
            if(middlewarePlugins.hasOwnProperty(key) && typeof middlewarePlugins[key] === "function"){
                middlewarePlugins[key].call(this, app);
            }
        }
    }
};