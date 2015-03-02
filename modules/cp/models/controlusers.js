/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    Types  = lizard.Field.Types;

var Model = new lizard.Model('ControlUsers', {
    createdDate: true, updatedDate: true
});

Model.add({

    email: { type: Types.Text, require: true, unique: true },
    password: { type: Types.Password, min: 6, index: true },
    name: { type: Types.Text }
    //role: { type: TypesEnum, state: "Administrator, Moderator, " }

});

Model.schema.index({ name: 'text' });

Model.schema.static('Login', function(email, password, cb){
    return this.findOne({email: email, password: this.encodePassword(password) }, cb);
});

Model.register(module.id);
