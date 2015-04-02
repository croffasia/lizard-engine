# v0.2.1 / 2015-04-03

* новшества; добавлен плагин middleware
* новшества; добавлена возможность глобальной переустановки роутеров
* новшества; добавлен метод импорта одного файла lizard.importFile('file');
* правка багов; исправлена ошибка настройки роутинга с указанием протокола get, post
* рефакторинг: рефакторинг модуля routing.js и modules.js

### Плагин middleware
Данный плагин подключается в расширении express.js. Его задача автоматическое подключение плагинов с директории plugins/middleware для
 расширения express.js.

**Пример подключения плагина:**

PROJECT_ROOT/index.js:

```javascript
var lizard = require('lizard-engine'),
   middleware = require('./middleware'); // Подключаем middleware модуль

lizard.on(lizard.EVENT_COMPLETE_CONFIGURE, function(){
   lizard.start();
});

lizard.init({
 'name': 'YOUR_PROJECT_NAME'
 ,'main controller': 'YOU_CONTROLLER_NAME'
 ,'application configure': middleware // указываем middleware прослойку
});
```

PROJECT_ROOT/middleware.js

```javascript
var lizard = require('lizard-engine');

module.exports = function(expressApplication, next){

 lizard.Plugins.Run(this, 'middleware', expressApplication); // запускаем системный плагин для поиска middleware плагинов
 next();

};
```

Пример расширяющего плагина можно посмотреть [здесь lizard-engine-social-auth](https://github.com/PoluosmakAndrew/lizard-engine-social-auth)

### Глобальный роутер

До этой версии общий роутинг настраивался каждым модулем отдельно. Начиная с версии 0.2.1 можно пользоваться настройкой в модулях, а так же
можно перекрыть все настройки в модулях глобальным роутером, который настраивается в одном общем файле. Более подробно [читайте здесь](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_routing.md#%D0%93%D0%BB%D0%BE%D0%B1%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F-%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0-%D1%80%D0%BE%D1%83%D1%82%D0%B8%D0%BD%D0%B3%D0%B0-%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%BD%D0%BE-%D1%81-%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D0%B8-021)

### Импорт файла lizard.importFile

Данный метод испортирует модуль по указанному пути относительно корня вашего проекта. Если испортируемого модуля не существует, то метод вернет null значение.

 ```javascript
var lizard = require('lizard-engine');
var myModule = lizard.importFile('myModule.js');
```

данный пример загружает модуль myModule.js с корневого каталога проекта.

# v0.2.0 / 2015-04-01

* новшества; поправлено и переработана логика работы с public директориями модулей
* новшества; добавлены переменные окружения популярных Cloud сервисов: MongoDB, PORT
* новшества; возможность кастомной настройки express.js
* новшества; обработка 500 ошибки
* изменения; изменен конфиг подключения к базе данных
* изменения; удалена библиотека underscore, вместо нее используется lodash
* правка багов; исправлена ошибка c обработкой 404 ошибки

# v0.1.2 / 2015-03-31

* правка багов; исправлена ошибка в функции импорта модулей, когда отсутствует директория