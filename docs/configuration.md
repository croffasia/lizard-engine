## Конфигурация LizardEngine

Конфигурацию приложения передается в стартовом модуле index.js при вызове функции lizard.init({CONFIGURATION});

### Обязательные параметры

**name**
> имя вашего приложения. Должно состоять из алфавитных символов латиницы.

**main controller**
> патч к главному контроллеру, который отвечает за домашнюю страницу.

### Остальные параметры конфигурации

**application configure**
> принимает ссылку на функцию для дополинтельной настройки express.js, функция должна принимать два параметра express и next, где express - это объект express(), next - это функция, которая должна быть выполнена после выполнения всех настроек.

**mongodb connect url**
> URL подключения к базе данных [MongoDB](http://docs.mongodb.org/manual/reference/connection-string/). По умолчанию используется mongodb://localhost. За имя базы данных принимается параметр конфигурации name. Данная настройка будет установлена автоматически при наличии переменных окружения: MONGODB_DB_URL, MONGOHQ_URL, MONGOLAB_URI, OPENSHIFT_MONGODB_DB_URL

**port**
> порт, на котором будет запущено приложение. По умолчанию проверяется переменная окружения PORT, если не найдена то утснавливается значение 4181

**cookies secret**
> секретный ключ для сессии.

## Документация

* [Быстрый старт](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/getstarted.md)
* [Архитектура приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/architecture.md)
* **Параметры настройки приложения**
* **Структура Модуля:**
    * [роутинг](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_routing.md)
    * [контроллеры](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_controller.md)
    * [компоненты](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_component.md)
    * [модель](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_model.md)
    * [шаблоны](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_template.md)
* [Плагины](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/plugins.md)