/**
 * Created by andriipoluosmak on 25.02.15.
 */

var inherits = require('inherits'),
	utils = require('util'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore');

var BaseEngineOptions = require('./core/options');

var moduleRoot = (function(_rootPath) {
    var parts = _rootPath.split(path.sep);
    parts.pop();
    return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);

var LizardEngine = function(){
	this._options = {
		'name': 'LizardApplication',
		'version': '0.0.1',

        'static dir': 'public',
        'cookies secret': 'xk3it95I4Z0NQerdVTD12TrT3naANxewTK16zaRSKtg7e4JjCtJoyB0BgiV1RD',
        'controllers dir': 'controllers',
        'component dir': 'components',
        'plugins dir': 'plugins',
        'models dir': 'models',
		'modules dir': 'modules',
		'template dir': 'views',

        'mongodb host': '',
        'mongodb db': '',
        'mongodb port': '',
        'mongodb user': '',
        'mongodb password': '',
		
		'template engine': 'nunjucks',
        'project dir': moduleRoot,

        'port': 3000
	};
};

inherits(LizardEngine, BaseEngineOptions);

var lizard = module.exports = exports = new LizardEngine();

lizard.express = require('./core/application');
lizard.template_engine = require("./views/"+lizard.get('template engine'));

lizard.View     = require('./core/view');
lizard.Routing  = require('./core/routing');
lizard.mongoose = require('mongoose');
lizard.MongoDB  = require('./core/mongodb');
lizard.Model    = require('./core/model');
lizard.Modules  = require('./core/modules');
lizard.Plugins  = require('./core/plugins');

LizardEngine.prototype.init = function(config){

    this.parseOptions(config);

    lizard.express.init();

    lizard.Modules.LoadModules();
    lizard.Plugins.LoadPlugins();

    lizard.MongoDB.connect();
    lizard.Routing.initialize();
};

LizardEngine.prototype.import = function(dirname){
    var initialPath = path.join(moduleRoot, dirname);

    var doImport = function(fromPath) {

        var imported = {};

        fs.readdirSync(fromPath).forEach(function(name) {

            var fsPath = path.join(fromPath, name),
                info = fs.statSync(fsPath);

            // recur
            if (info.isDirectory()) {
                imported[name] = doImport(fsPath);
            } else {
                // only import files that we can `require`
                var ext  = path.extname(name);
                var base = path.basename(name, ext);
                if (require.extensions[ext]) {
                    imported[base] = require(fsPath);
                }
            }

        });

        return imported;
    };

    return doImport(initialPath);
};

LizardEngine.prototype.start = function(){
    this.express.start();
};