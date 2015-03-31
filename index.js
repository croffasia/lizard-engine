/**
 * Created by andriipoluosmak on 25.02.15.
 */

var utils = require('util'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore');

var BaseEngineOptions = require('./core/options');

/**
 * Project dir
 */
var moduleRoot = (function(_rootPath) {
    var parts = _rootPath.split(path.sep);
    parts.pop();
    return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);

/**
 * Engine dir
 */
var engineRoot = (function(_rootPath) {
    var parts = _rootPath.split(path.sep);
    parts.pop();
    return parts.join(path.sep);
})(module.paths[0]);

var LizardEngine = function()
{
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

        'main controller': '',
        'user model': 'user.model',
		
		'template engine': 'nunjucks',
        'project dir': moduleRoot,
        'engine dir': engineRoot,

        'port': 3000
	};

    this.Errors = {};
};

utils.inherits(LizardEngine, BaseEngineOptions);

var lizard = module.exports = exports = new LizardEngine();

// Load engine modules

lizard.Application = require('./core/application');
lizard.View        = require('./core/view');
lizard.Database    = require('./core/mongodb');
lizard.Modules     = require('./core/modules');
lizard.Plugins     = require('./core/plugins');
lizard.Routing     = require('./core/routing');
lizard.Utils       = require('./lib/utils');

/**
 * Initialize engine
 * @param config
 */
LizardEngine.prototype.init = function(config){

    this.parseOptions(config);
    lizard.Application.init();

    this.Errors = this.importLocal('lib/errors');

    lizard.Modules.LoadModules();
    lizard.Plugins.LoadPlugins();
    lizard.Routing.initialize();
};

/**
 * Import modules from Project directory
 * @param dirname
 */
LizardEngine.prototype.import = function(dirname){
    var initialPath = path.join(moduleRoot, dirname);

    var doImport = function(fromPath) {

        var imported = {};

        try {
            fs.readdirSync(fromPath).forEach(function (name) {

                var fsPath = path.join(fromPath, name),
                    info = fs.statSync(fsPath);

                if (info.isDirectory()) {
                    imported[name] = doImport(fsPath);
                } else {
                    var ext = path.extname(name);
                    var base = path.basename(name, ext);
                    if (require.extensions[ext]) {
                        imported[base] = require(fsPath);
                    }
                }

            });
        } catch(e){};

        return imported;
    };

    return doImport(initialPath);
};

/**
 * Import modules from engine directory
 * @param dirname
 */
LizardEngine.prototype.importLocal = function(dirname){
    var initialPath = path.join(engineRoot, dirname);

    var doImport = function(fromPath) {

        var imported = {};

        try {
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
        } catch(e){};

        return imported;
    };

    return doImport(initialPath);
};

/**
 * Start engine
 */
LizardEngine.prototype.start = function(){
    console.log("Start Server");
    this.Application.start();
};