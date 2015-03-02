/**
 * Created by andriipoluosmak on 25.02.15.
 */

var lizard = require('lizard-engine');
var nunjucks = require('nunjucks');

var ViewComponent = function()
{
}

ViewComponent.prototype.init = function(dir)
{
    nunjucks.configure(dir, { autoescape: false });
}

ViewComponent.prototype.render = function()
{
    nunjucks.render.apply(this, arguments);
}

module.exports = new ViewComponent();