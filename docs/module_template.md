## Шаблоны (Views)

В LizardEngine используется шаблонизатор от [Mozilla - Nunjucks](https://mozilla.github.io/nunjucks/).
Шаблоны доступные в модулях должны находится в директории **views**.

Для основного шаблона вашего приложения предназначена директория **views** в корне проекта. В ней могут располагаться только
базовый шаблон скелет вашего приложения и страницы ошибок.

Для наследования шаблонов модулей от общего шаблона используйте переменную template_dir:

> {% extends template_dir + "/layouts/main.html" %}

Более детально о разметке шаблонизатора читайте на [сайте Nunjucks](https://mozilla.github.io/nunjucks/templating.html)

При ренедре шаблона, контроллер передает объект locals в шаблон, который может быть использован для заполнения данными.

P.S. В следующих версиях появится возможность переключения различных шаблоннизаторов.

## Документация

* [Быстрый старт](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/getstarted.md)
* [Архитектура приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/architecture.md)
* [Параметры настройки приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/configuration.md)
* **Структура Модуля:**
    * [роутинг](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_routing.md)
    * [контроллеры](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_controller.md)
    * [компоненты](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_component.md)
    * [модель](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_model.md)
    * **шаблоны**
* [Плагины](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/plugins.md)