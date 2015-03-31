## Архитектура приложения

Приложение строится на модулях с [MVC - Model-Viewer-Controller](https://ru.wikipedia.org/wiki/Model-View-Controller) архитектурой.
Файловая структура проекта:

* MyApp/
    * modules/
        * app/
            * controllers/
            * components/
            * models/
            * public/
            * views/
            * routing.json
    * node_modules/
    * public/
    * plugins/
    * views/
    * index.js
    * package.json

### modules

В папке **modules** распологаются все модули приложения

### app

Пример базового модуля **app** с директориями: controllers, components, models, views.
Все директории создавать не обязательно, если вы допустим не используете компоненты или модель в каком-то из модулей.

### public

Директория с файлами стилей, картинками, скриптами и т.п. Есть общая диреткория, файлы с которой доступны с корневого URL вашего приложения,
а так же локальные файлы модулей, которые находятся в MyModule/public доступны по адресу /public/m/MyModule/

### plugins

Общая директория для плагинов.

### views

Директория для основного шаблона сайта и страниц ошибок 404 и 500

## Документация

* [Быстрый старт](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/getstarted.md)
* **Архитектура приложения**
* **Структура Модуля:**
    * [роутинг](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_routing.md)
    * [контроллеры](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_controller.md)
    * [компоненты](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_component.md)
    * [модель](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_model.md)
    * [шаблоны](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_template.md)
* [Плагины](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/plugins.md)
