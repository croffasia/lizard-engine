## Плагины

Плагин - независимый программный модуль, который не привязан ни к какому из модулей и предназначен для выполнения общих функций.

**Директория для компонентов:** plugins

**Запуск плагина:**

> lizard.Plugins.Run(this, 'plugin_name', ...arguments);

где, this - контекст в рамках которого требуется запустить плагин, plugin_name - путь к плагину и ...arguments - любые принимаемые плагином аргументы

**Пример плагина для быстрого доступа к компонентам в программном коде:**

```javascript
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
```

## Системные плагина

* components // плагин для запуска компонентов
* auth // плагин контроля авторизации пользователя

# Документация

* [Быстрый старт](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/getstarted.md)
* [Архитектура приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/architecture.md)
* [Параметры настройки приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/configuration.md)
* **Структура Модуля:**
    * [роутинг](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_routing.md)
    * [контроллеры](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_controller.md)
    * [компоненты](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_component.md)
    * [модель](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_model.md)
    * [шаблоны](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_template.md)
* **Плагины**