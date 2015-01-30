(function (global) {
    'use strict';

    function Entry(user, date, from, to) {
        this.user = user;
        this.date = date;
        this.from = from;
        this.to = to;
        this.pauses = [];
    }
    
    Entry.prototype.addPause = function (timeInMinutes) {
        this.pauses.push(timeInMinutes);
    };
    
    Entry.prototype.asString = function () {
        return JSON.stringify({
            "user" : this.user,
            "date" : this.date,
            "from" : this.from,
            "to" : this.to,
            "pauses" : this.pauses
        });
    };
    
    global.Entry = Entry;
}(window));