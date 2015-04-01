## Контроллеры

Обеспечивает связь между пользователем и системой: контролирует ввод данных пользователем и использует модель и представление для реализации необходимой реакции.

Контроллер изолирован в модуль и располагается в папке модуля - controllers.
Каждый контроллер отвечает исключительно за одно условие роутинга, указанное в [routing.json](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_routing.md)

**Пример базового контролера**

```javascript
// Подкдючаем LizardEngine
var lizard = require('lizard-engine');

// Экспорт модуля (req - request; res - response объекты expressjs)
module.exports = function(req, res){

    // Создание View объекта. Передаем request, response и ID текущего модуля
    var view = new lizard.View(req, res, module.id);

    // Объект локальных переменных, которые будут переданы в шаблон
    var locals = view.locals;

    // init срабатывает при инициализации контроллера. Все события view.on отрабатываются
    // в той последовательности, в которой были установлены в контроллере

    view.on('init', function(next){

        locals.title = "Welcome to My Page";

        // Говорим об окончании работы данного блока
        next();
    });

    // Событие get срабатывает при налиции в GET запросе указанных параметров и их свойств
    // указанных во втором параметре.
    view.on('get', {action: 'test'}, function(next){
        next();
    });

    // Событие post срабатывает при налиции в POST запросе указанных параметров и их свойств
    // указанных во втором параметре.
    view.on('post', {action: 'test'}, function(next){
        next();
    });

    // Событие params срабатывает при налиции в URL (роутинг) указанных параметров и их свойств
    // указанных во втором параметре.
    view.on('params', {action: 'test'}, function(next){
        next();
    });

    // рендер шаблона (шаблоны должны находится в текущем модуле папке views.
    // Можно использовтаь любую вложенность внутри этой папки )
    view.render('template.html');
};
```

## Документация

* [Быстрый старт](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/getstarted.md)
* [Архитектура приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/architecture.md)
* [Параметры настройки приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/configuration.md)
* **Структура Модуля:**
    * [роутинг](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_routing.md)
    * **контроллеры**
    * [компоненты](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_component.md)
    * [модель](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_model.md)
    * [шаблоны](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_template.md)
* [Плагины](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/plugins.md)