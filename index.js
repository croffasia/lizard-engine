/**
 * Created by andriipoluosmak on 25.02.15.
 */

var utils = require('util'),
    path = require('path'),
    fs = require('fs');

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
    this.EVENT_COMPLETE_CONFIGURE = "completeConfigure";

	this._options = {

        'name': 'LizardApplication',
		'version': '0.0.1',

        'cookies secret': 'xk3it95I4Z0NQerdVTD12TrT3naANxewTK16zaRSKtg7e4JjCtJoyB0BgiV1RD',

        'static dir': 'public',
        'controllers dir': 'controllers',
        'component dir': 'components',
        'plugins dir': 'plugins',
        'models dir': 'models',
		'modules dir': 'modules',
		'template dir': 'views',

        'mongodb connect url': 'mongodb://localhost',

        'main controller': '',
        'application configure': '',
		
		'template engine': 'nunjucks',
        'project dir': moduleRoot,
        'engine dir': engineRoot,

        'port': process.env.PORT || 4181
	};
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
    this.Errors = this.importLocal('lib/errors');
    this.Database.init();
    lizard.Plugins.LoadPlugins();

    var context = this;

    lizard.Application.init(function(){

        lizard.Modules.LoadModules();
        lizard.Routing.initialize();

        context.emit(context.EVENT_COMPLETE_CONFIGURE);
    });
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
 * Import local file
 * @param file
 * @returns {*} module
 */
LizardEngine.prototype.importFile = function(file){

    var module = null;
    var filePath = path.join(moduleRoot, file);

    if (fs.existsSync(filePath)) {
        module = require(filePath);
    }

    return module;
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