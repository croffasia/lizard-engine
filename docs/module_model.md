## Модель

Модель данных предназначена для работы с базой данных, в нашем случае это MongoDB. Для работы с базой данных используется
модуль [mongodb](https://www.npmjs.com/package/mongodb).

**Директория для моделей:** models

Модель привязана к кокнретному модулю, но может использоваться в любом месте.

**Получение объекта модели**

```javascript
// Подключаем модель user.js, которая принадлежит модулю app
var UserModel = lizard.Modules.Model('app', 'user');
```

**Пример базовой модели user.js:**

```javascript
var lizard = require('lizard-engine'), // Подключаем LizardEngine
    BaseModel = lizard.Database.Model, // Базовый класс модели
    Types     = lizard.Database.Types, // Типы полей
    util = require("util");

// Класс модели
var Model = function()
{
    // Вызов конструктора базового класса - обязательно
    BaseModel.apply(this);

    // Название коллекции в MongoDB, с которой модель будет работать
    this.collection = "users";

    // Конфигурация полей коллекции
    this.init({
              "email"    : { type: Types.String, required: true, format: "email" }
            , "password" : { type: Types.String, required: true, allowEmpty: false }
            , "name"     : { type: Types.String, allowEmpty: true, maxLength: 60 }
        });

};

// Наследуем класс от базовой модели
util.inherits(Model, BaseModel);

// Експорт модели
module.exports = Model;
```

## Конфигурация полей коллекции

Конфигаруация полей коллекции оставлена на усмотрения разботчика. Если вам нужно получить контролируемую модель с расширенной валидацией, 
вам нужно определить схему коллекции, присвоив объект схемы через this.init(schema). Полное описание схемы смотрите в npm пакете, который использован 
 для контроля полей [revalidator](https://www.npmjs.com/package/revalidator). 
 
Поддерживаемые типы полей валидации вынесены в свойство объекта Database - Types.

Схемы поддерживают любую вложенность объектов.

### Валидация поля

По умолчанию модель не валидирует данные, а решение о валидации в какой-либо момент и какой-либо части вашей схемы оставлено на разработчика.
Наследуясь от базового класса модели, каждая модель имеет два метода 

**validate(document)**

Данный метод валидирует переданный ему документ в соотвествии с описанной схемой валидации и возвращает результат валидации [revalidator](https://www.npmjs.com/package/revalidator).
Это объект с двумя полями {valid: true/false, errors: []}. Более подробно о возвращаемых значениям расказано в [revalidator](https://www.npmjs.com/package/revalidator).

**validatePart(field, document)**

Данный метод будет полезен, если вам нужно валидировать лишь часть документа, или отдельные поля. Первым параметром передается 
либо название поля (если ключ находится в корне схемы) или путь к вложенному объекту(полю). Вторым параметром передается валидируемый документ. 

Например: допустим схема содержит вложенный объект social
 
```javascript
{
  "name"     : { type: Types.String, allowEmpty: true, maxLength: 60 },
  "social"   : { type: Types.Object, properties: { 
                                                  fb_id: { type: Types.String, require: true }
                                                  twitter_id: { type: Types.String }
                                                 }
               }
}
```

Вам нужно проверить лишь часть схемы social. Для необходимо:

```javascript
model.validatePart('social', { fb_id: "34335435435", twitter_id: "43435453432" });
```

Также само можно проверить одно поле fb_id:

```javascript
model.validatePart('social.fb_id', { fb_id: "34335435435" });
```

### Выполнение запросов

Для выполнения запросов используется метод **build()**, который возвращает объект mongodb - Collection ссылка на коллекцию, связанную с моделью.
Подробное описание с native библиотекой mongodb и коллекцией вы найдете на [официальном сайте](http://docs.mongodb.org/manual/reference/method/js-collection/)

## Документация

* [Быстрый старт](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/getstarted.md)
* [Архитектура приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/architecture.md)
* [Параметры настройки приложения](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/configuration.md)
* **Структура Модуля:**
    * [роутинг](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_routing.md)
    * [контроллеры](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_controller.md)
    * [компоненты](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_component.md)
    * **модель**
    * [шаблоны](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/module_template.md)
* [Плагины](https://github.com/PoluosmakAndrew/lizard-engine/blob/master/docs/plugins.md)