/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine'),
    _ = require('underscore'),
    transliteration = require('transliteration.cyr');

var Model = function(name, options){
    this.schema = new lizard.Database.mongoose.Schema();

    this.schema_config = [];
    this.schema_mongodb = {};
    this.model = null;
    this.name = name;
    this.options = options;
};

Model.prototype.add = function()
{
    var args = Array.prototype.slice.call(arguments, 0);

    if(args && args.length > 0)
    {
        //console.log(require('util').inspect(args));
        //console.log(require('util').inspect(lizard.Field.Types));

        for(var i = 0; i < args.length; i++)
        {
            if(typeof args[i] === "object")
            {
                var types = {};

                for(var key in args[i])
                {
                    var type = args[i][key].type;
                    var typeExec = (typeof type === 'function')?type:lizard.Field.Types[type];

                    console.log();

                    if(typeExec){
                        types[key] = new typeExec(this.schema, args[i][key], key);
                    } else {
                        types[key] = args[i][key];
                        var it = {};
                        it[key] = args[i][key];
                        this.schema.add(it);
                    }
                }

                //this.schema_config.push(types);

            } else {
                //this.schema_config.push(args[i]);
            }
        }
    }
}

String.prototype.replaceAll = function(search, replace){
    return this.split(search).join(replace);
};

Model.prototype.register = function(module)
{
    if(this.options != null)
    {
        if(_.has(this.options, 'slug') && this.options.slug != "")
        {
            var slugItem = {slug: { type: String, index: { unique: true }  }};
            this.schema.add(slugItem);
            var context = this;

            var replaceAll = function(search, replace){
                return this.split(search).join(replace);
            };

            this.schema.pre('save', function (next) {

                this.slug = transliteration.transliterate(this[context.options.slug]).toLowerCase().replaceAll(' ', '');

                next();
            })
        }
    }

    var moduleName = lizard.Utils.GetModuleFromID(module);

    if(moduleName != ""){

        this.model = lizard.Database.mongoose.model(this.name, this.schema);
        //if(!_.has(lizard.models, moduleName.toLowerCase())) lizard.models[moduleName.toLowerCase()] = {};
        lizard.models[this.name.toLowerCase()] = this;
    }
};

module.exports = Model;