/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    validator = require('validator'),
    _ = require('underscore'),
    crypt = require('crypto-js');

module.exports = function(req, res){

    var view = new lizard.View(req, res, module.id, lizard.get('engine dir'));

    var ControlModel = lizard.Modules.Model("cp", "ControlUsers");

    // Login Ajax Action
    var context = this;

    view.on('get', {action: 1}, function(next){

        var item = new ControlModel.model();
        item.email = req.query.email;
        item.password = req.query.password;
        item.save();

        next();
    });

    view.on('post', {action: 'cp.login'}, function(next){

        var email = "";
        var password = "";

        if(_.has(req.body, 'email') && validator.isEmail(req.body.email))
            email = validator.escape(req.body.email);

        if(_.has(req.body, 'password'))
            password = validator.escape(req.body.password);

        if(email != "" && password != ""){
            ControlModel.model.Login(email, password, function(err, results){
                console.log(err, results);

                if(err == null && results != null && results._id != "")
                {
                    lizard.Plugins.Run(context, 'auth.save', req, results);

                    res.redirect('/cp');
                    return;
                } else {
                    req.flash('error', 'Пользователь не найден!');
                    res.redirect('/cp/login');
                    return;
                }

            });
        } else {
            req.flash('error', 'Email и пароль не могут быть пустыми!');
            res.redirect('/cp/login');
            return;
        }

        return;
    });

    view.locals.flash_message_error = req.flash('error');

    view.render('login.html');

};