## Компоненты

Компоненты нужны для выноса определенной функциональности, которую нужно использовать в разных модулях.
Компонент обязательно должен принадлежать одному из модулей.

**ВАЖНО:** если ваш компонент использует AJAX зпросы или обработку форм, всегда отправляйте на текущую страницу и обрабатывайте их в компоненте.
Пример: AJAX запрос может иметь вид ?action_name=action_value

**Директория для компонентов:** components

**Пример базового компонента:**

```javascript
// Подключаем LizardEngine
var lizard = require('lizard-engine');

/**
 * Экспортируем модуль компонента
 * @param req ExpressJS Request
 * @param res ExpressJS Response
 * @param options дополнительные опции (на усмотрение)
 * @param callback возврат результата работы компонента в виде HTML
 */
module.exports = function(req, res, options, callback){

    // Предоставляем возможность не обязательного указание параметра  опций
    if(typeof options === "function"){
        callback = options;
        options = {};
    }

    // Инициализируем View
    var view = new lizard.View(req, res, module.id);

    // Инициализируем локальные переменные, которые будут переданы в шаблон
    var locals = view.locals;

    // Передаем в шаблон внешние опции, с которыми был запущен компонент
    locals.options = options;

    // Рендер шаблона компонента, вторым парамтером указываем callback парамтер переданный в компонент.
    // В компонентах также доступны все события View.on
    view.render('components/test.html', callback);
};
```

## Способы подключения и вызова компонентов

**Самый простой способ** - тег в шаблоне или контенте вашего приложения

> [[app.test]]

Данный тэг вызовет и вставит в текущее место результат работы компонента test, который принадлежит модулю app.

Если нужно передать какие-либо параметры в компонент воспользутесь следующим синтаксисом:

> [[app.test|{"option_name":"option_value"}]]

После разделителя | в JSON формате передаем требуемые данные.

**Вызов с программного кода**

Пример 1:
```javascript
view.on('init', function(next){

    // Делегируем запуск и инициализацию компонента системному плагину с названием component
    // Вызываем компонент test, приналдлежащий модулю app
    lizard.Plugins.Run(this, "component", "app.test", res, req, {say: "Hello ;-)"}, function(result){
        console.log(result);
        next();
    });

});
```

Пример 2:
```javascript
view.on('init', function(next){

    // Получаем класс компонента test принадлежащего модулю app
    var com = lizard.Modules.Component('app', 'test');

    // Если компонент найден
    if(com != null)
    {
        // Инициализируем компонент, передаем нужные ему параметры
        new com(res, res, {say: "Hello ;-)"}, function(result){

            // и обрабатываем результат работы в виде HTML
            console.log(result);
            next();
        });

    } else {
        next();
    }
});
```

## Документация

* [Быстрый старт](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/getstarted.md)
* [Архитектура приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/architecture.md)
* **Структура Модуля:**
    * [роутинг](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_routing.md)
    * [контроллеры](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_controller.md)
    * **компоненты**
    * [модель](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_model.md)
    * [шаблоны](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_template.md)
* [Плагины](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/plugins.md)