'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var PRIORITY_OF_COMMANDS = {
    'select': 3,
    'filterIn': 0,
    'sortBy': 1,
    'format': 4,
    'limit': 2
};

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var commands = [].slice.call(arguments, 1);
    var copyCollection = collection.map(function (item) {
        return copyItem(item);
    });

    return commands
        .sort(function (first, second) {
            var firstCommand = PRIORITY_OF_COMMANDS[first.name];
            var secondCommand = PRIORITY_OF_COMMANDS[second.name];
            if (firstCommand > secondCommand) {
                return 1;
            }
            if (secondCommand > firstCommand) {
                return -1;
            }

            return 0;
        })
        .reduce(function (queryResult, query) {
            return query(queryResult);
        }, copyCollection);
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (item) {
            return fields.reduce(function (newFriend, field) {
                if (item.hasOwnProperty(field)) {
                    newFriend[field] = item[field];
                }

                return newFriend;
            }, {});

        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (index) {
            return values.indexOf(index[property]) !== -1;
        });

    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        return collection.sort(function (first, second) {
            if (first[property] > second[property]) {
                return (order === 'desc') ? -1 : 1;
            }
            if (first[property] < second[property]) {
                return (order === 'desc') ? 1 : -1;
            }

            return 0;
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {

    return function format(collection) {
        return collection.map(function (item) {
            if (item.hasOwnProperty(property)) {
                item[property] = formatter(item[property]);
            }

            return item;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    return function limit(collection) {
        var countOfNotes = 0;
        if (count > 0) {
            countOfNotes = count;
        }

        return collection.slice(0, countOfNotes);
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}

function copyItem(item) {
    return Object.keys(item).reduce(function (cloneItem, field) {
        cloneItem[field] = item[field];

        return cloneItem;
    }, {});
}
