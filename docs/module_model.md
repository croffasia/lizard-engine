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
    util = require("util");

// Класс модели
var Model = function()
{
    // Вызов конструктора базового класса - обязательно
    BaseModel.apply(this);

    // Название коллекции в MongoDB, с которой модель будет работать
    this.collection = "users";

    // Конфигурация полей коллекции
    this.columns = {_id: null,
                    name: null,
                    email: null
                   };

};

// Наследуем класс от базовой модели
util.inherits(Model, BaseModel);

// Експорт модели
module.exports = Model;
```

## Конфигурация полей коллекции

Конфигурация представляет собой объект, в котором ключи - это название полей в коллекции и значения ключа.
Значение ключа может быть null, если не нужно указывать дополнительных параметров валидации или форматирования.

### Валидация поля

Валидировать поле двумя тремя способами:встроенные функции Validation, свои функции валидации описанные в модели.

Для валидации используется NPM модуль [Validation](https://www.npmjs.com/package/validator).

**Примеры использовани встроенных функций валидации**

Пример 1:
> email: {validation: "isEmail"}

Для валидации поля email будет использован метод isEmail модуля Validation. При использовании встроенных функция валидации можно
указать обратное значение возвращаемое функцией

> email: {validation: "!isEmail"}

Если нужно подключить несколько различных валидаторов:

> email: {validation: ["isEmail", "otherValidator"] }

Валидация происходит в той же последовательности, в которой были указаны функции.
Если потребуется передать дополнительные параметры валидации в эти функции, то можно указать в следующем формате:

> email: {validation: [{action: "isEmail", options: [{ allow_display_name: false, allow_utf8_local_part: true} ] }] }

Теперь массив содержит объекты со свойствами action - указатель на валидатор и массив опций options, в который мы передаем
требуемые опции.

**Важно:** опции должны быть переданы в той же последовательности, в которой они принимаются функцией валидации
за исключением первого параметра - значения поля.

**Примеры использования собственных функций валидации**

Собственые функции валидации используются аналогично встроенным, только вместо названия встроенной функции указывается ссылка на функцию валиддатор.

Пример:
```javascript
var lizard = require('lizard-engine'), // Подключаем LizardEngine
    BaseModel = lizard.Database.Model, // Базовый класс модели
    util = require("util");

// Собственная функция валидации
function isEmail(value){
    return (value.indexOf("@") > -1)?true:false;
}

// Класс модели
var Model = function()
{
    // Вызов конструктора базового класса - обязательно
    BaseModel.apply(this);

    // Название коллекции в MongoDB, с которой модель будет работать
    this.collection = "users";

    // Конфигурация полей коллекции
    this.columns = {_id: null,
                    name: {validation: [{action: this.nameValidation, options: [3,20] ] },
                    email: {validation: isEmail }
                   };

};

// Наследуем класс от базовой модели
util.inherits(Model, BaseModel);

// Встроеная функция валидации имени пользователя, котрая проверяет минимальную и максимальную длину имени
Model.prototype.nameValidation = function(value, minLength, maxLength){

    return (typeof value === "string"
            && value.length >= minLength
            && (maxLength != undefined && value.length <= maxLength || maxLength == undefined))?true:false;

};


// Експорт модели
module.exports = Model;
```

### Форматирование полей

Вы можете указать форматирование полей документа в параметре:

> email: {format: myFormat}

где, myFormat - функция в вашей модели или любом подключенном модуле, который примет значение и возвратит отформатированное.

Форматирование не используется автоматически при запросах к базе данных. Для форматирования документа нужно вызвать функцию

```javascript
var formatedDocument = Model.FormatDocument(document);
```
Данная функция форматирует переданный ей документ и возвращает отформатированную копию, не делая изменений в текущем объекте.

### Базовый функции модели

#### clear(callback)
Очищает всю коллекцию, результат работы возвращает в переданный callback с параметрами error, result

#### insert(document, callback)
Добавляет новый документ в ,азу данных, результат работы возвращает в переданный callback с параметрами error, result.
Примечание: функции insert и update удалят поля в документе, если они не были описаны в свойстве модели this.columns

#### update(where, document, callback)
Записывает изменения указанные в параметре document в существующий документ. Условия поиска документа для обновления указываются в
парамтере where, результат работы возвращает в переданный callback с параметрами error, result.

#### FormatDocument(document)
Форматирует переданный документ в соотвествии с конфигурацией форматирования в this.columns. Возвращает отформатированный объект,
 без изменения оригинального.

#### remove(where, callback)
Удаляет существующий документ. Условия поиска документа для удаления указываются в парамтере where, результат работы
возвращает в переданный callback с параметрами error, result.

#### find(where, callback)
Ищет документы. Условия поиска документов указываются в парамтере where, результат работы возвращает в переданный
callback с параметрами error, result (массив объектов).

#### findOne(where, callback)
Ищет один документ. Условия поиска документа указываются в парамтере where, результат работы возвращает в переданный
callback с параметрами error, result (объект документа).

#### cursor(callback)
Возвращает cursor коллекции, для более продвинутых запросов к базе даных.

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