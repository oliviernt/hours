(function (global, document) {
    'use strict';
    if (!global.localStorage) {
        global.alert("Sorry, your browser doesn't support the LocalStorage API which is a requirement for using this App.");
        return;
    }
    var userInput = document.querySelector('input[name=name]'),
        dateInput = document.querySelector('input[name=date]'),
        fromInput = document.querySelector('input[name=from]'),
        toInput = document.querySelector('input[name=to]'),
        pauseInput = document.querySelector('input[name=pause]'),
        outputArea = document.querySelector('table tbody'),
        form = document.querySelector('form'),
        today = new Date(),
        store = new Store(),
        RADIX = 10;

    dateInput.max = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();
    dateInput.value = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();

    if (global.localStorage.getItem('user')) {
        userInput.value = global.localStorage.getItem('user');
    }
    
    userInput.addEventListener('keyup', function () {
        global.localStorage.setItem('user', userInput.value);
    });
    
    var toMinutes = function (timeString) {
        var split = timeString.split('h');
        if (timeString.indexOf('h') === -1) {
            split = timeString.split(':');
        }
        var hour = parseInt(split[0], RADIX);
        var minutes = parseInt(split[1], RADIX);
        return hour * 60 + minutes;
    };
    
    var toTimeString = function (minutes) {
        return parseInt(minutes / 60, RADIX) + 'h' + (minutes % 60)
    };
    
    /**
    * add an entry to current user list.
    */
    var addEntry = function () {
        console.log('adding entry');
        var entry = store.getByDate(dateInput.value);
        var exists = !!entry;
        if (!exists) {
            entry = new Entry(userInput.value, dateInput.value, fromInput.value, toInput.value);
        }
        if (pauseInput.value.length > 0) {
            try {
                entry.addPause(parseInt(pauseInput.value, RADIX));
            } catch (e) {
                global.alert(e.message);
            }
        }
        if (exists) {
            store.update(entry);
        } else {
            store.add(entry);
            writeEntry(entry);
        }
    };
    
    /**
     * Write an entry to the output area
     */
    var writeEntry = function (entry) {
        console.log('writing entry ' + entry.asString());
        var div = document.createElement('tr');
        div.className = 'entry';
        
        var date = document.createElement('td');
        date.className = 'entry__date';
        date.innerHTML = entry.date;
        div.appendChild(date);
        
        var from = document.createElement('td');
        from.className = 'entry__hour';
        from.innerHTML = entry.from;
        div.appendChild(from);
        
        var to = document.createElement('td');
        to.className = 'entry__hour';
        to.innerHTML = entry.to;
        div.appendChild(to);
        
        var minutes = toMinutes(entry.to);
        minutes -= toMinutes(entry.from);
        
        var pauses = 0;
        var elem = document.createElement('td');
        elem.className = 'entry__pause';
        entry.pauses.forEach(function (pause) {
            pauses += pause;
            minutes -= pause;
        });
        if (pauses > 0) {
            elem.innerHTML =  toTimeString(pauses);
        } else {
            elem.innerHTML = '-';
        }
        div.appendChild(elem);
        
        var sum = document.createElement('td');
        sum.className = 'entry__sum';
        sum.innerHTML = toTimeString(minutes);
        div.appendChild(sum);
        
        outputArea.appendChild(div);
    };
    
    /**
     * Write all entries to output area.
     */
    var writeAll = function () {
        outputArea.innerHTML = "";
        store.getAll().forEach(function (object) {
            var entry = new Entry(object.name, object.date, object.from, object.to);
            object.pauses.forEach(function (pause) {
                entry.addPause(pause);
            });
            writeEntry(entry);
        });
    };
    
    writeAll();
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        addEntry();
    });
}(window, document));