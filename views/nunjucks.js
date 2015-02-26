/**
 * Created by andriipoluosmak on 25.02.15.
 */

var lizard = require('lizard-engine');
var nunjucks = require('nunjucks');
var MongooseExtension = require('nunjucks-mongoose');

var ViewComponent = function()
{
    this.init();
};

ViewComponent.prototype.init = function()
{
    nunjucks.configure(lizard.get('project dir'), { autoescape: false });
}

ViewComponent.prototype.render = function()
{
    nunjucks.render.apply(this, arguments);
}

module.exports = new ViewComponent();