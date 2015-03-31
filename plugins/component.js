/**
 * Created by andriipoluosmak on 26.02.15.
 */

/**
 * Данный плагин предназначен для быстрого запуска компонентов в программном коде
 */

// Подключаем LizardEngine
var lizard = require('lizard-engine');

/**
 * Класс плагина
 *
 * @param path путь к плагину, директории разделяются точкой.
 * @param req объект Request ExpressJS
 * @param res объект Response ExpressJS
 * @param options дополнительные опции вызова компонента
 * @param cb функция в которую будет возвращен результат обработки данных
 */
module.exports = function(path, req, res, options, cb)
{
    // Код плагина
    var path_array = path.split(".");

    if(path_array != undefined && path_array.length > 1)
    {
        var module = path_array[0];
        path_array.shift();

        var action = path_array.join(".");
        var component = lizard.Modules.Component(module, action);

        if(component != null) component.call(this, req, res, options, cb);
    } else {
        cb("");
    }
};