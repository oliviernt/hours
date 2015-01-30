(function (global) {
    'use strict';
    function Store() {
        this._store = [];
        this.reload();
    }
    
    /**
     * Add an entry
     */
    Store.prototype.add = function (object) {
        this._store.push(object);
        this.persist();
    };
    
    /**
     * Update a single entry based on date
     */
    Store.prototype.update = function (entry) {
        var result = this._store.some(function (currentEntry, index) {
            if (entry.date === currentEntry.date) {
                this._store[index] = entry;
                return true;
            }
            return false;
        }, this);
        this.persist();
        return result;
    };
    
    /**
     * Return entry for date
     */
    Store.prototype.getByDate = function (date) {
        if (date instanceof Date) {
            date = date.getYear() + '-' + date.getMonth() + '-' + date.getDay();
        }
        var _entry;
        this._store.some(function (entry) {
            if (date === entry.date) {
                _entry = entry;
                return true;
            }
            return false;
        });
        return _entry;
    };
    
    /**
     * Return all entries
     */
    Store.prototype.getAll = function () {
        this._store.sort(function (a, b) {
            var dateA = new Date(a.date),
                dateB = new Date(b.date);
            return dateA.getTime() > dateB.getTime();
        });
        return this._store;
    };
    
    Store.prototype.remove = function (index) {
        this._store.splice(index, 1);
        this.persist();
    };
    
    /**
     * Persist data to localStorage
     */
    Store.prototype.persist = function () {
        global.localStorage.setItem('storage', JSON.stringify(this._store));
    };
    
    /**
     * Load data from localStorage
     */
    Store.prototype.reload = function () {
        var storage = global.localStorage.getItem('storage');
        if (!storage) {
            storage = "[]";
        }
        this._store = JSON.parse(storage);
        this.persist();
    };
    
    global.Store = Store;
}(window));