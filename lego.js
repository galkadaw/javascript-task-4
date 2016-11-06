'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var PRIORITY_OF_METHODS = {
    'select': 2,
    'filterIn': 0,
    'sortBy': 1,
    'format': 3,
    'limit': 3
};

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var commands = [].slice.call(arguments, 1);
    if (collection === null) {
        return null;
    }
    var copyCollection = collection.slice();
    commands.sort(function (first, second) {
        if (PRIORITY_OF_METHODS[first.name] > PRIORITY_OF_METHODS[second.name]) {
            return 1;
        }
        if (PRIORITY_OF_METHODS[second.name] > PRIORITY_OF_METHODS[first.name]) {
            return -1;
        }

        return 0;
    })
        .forEach(function (query) {
            copyCollection = query(copyCollection);
        });

    return copyCollection;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);

    return function select(collection) {
        var collectionNewFriends = [];
        collection.forEach(function (item) {
            var newFriend = {};
            for (var key in item) {
                if (item.hasOwnProperty(key) && fields.indexOf(key) !== -1) {
                    newFriend[key] = item[key];
                }
            }

            if (Object.keys(newFriend).length !== 0) {
                collectionNewFriends.push(newFriend);
            }

        });

        return collectionNewFriends;
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
        var newCollection = collection.sort(function (first, second) {
            if (first[property] > second[property]) {
                return 1;
            }
            if (first[property] < second[property]) {
                return -1;
            }

            return 0;
        });
        if (order === 'desc') {
            newCollection.reverse();
        }

        return newCollection;
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
                var itemClone = copyItem(item);
                itemClone[property] = formatter(item[property]);

                return itemClone;
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
    var cloneItem = {};
    for (var key in item) {
        if (item.hasOwnProperty(key)) {
            cloneItem[key] = item[key];
        }
    }

    return cloneItem;
}
