$(function(){
    //getWeatherData('ua', dataReceived, showError);
    getWeatherByCity('ua', dataReceived, showError, 'Lviv');

    function dataReceived(data) {
        var city = data.city.name;
        var country = data.city.country;

        $.each(data.list, function(){
            // "this" тримає об'єкт прогнозу звідси: http://openweathermap.org/forecast16
            addWeather(
                this.weather[0].icon,
                getDayFromDt(this.dt),
                this.weather[0].description,
                Math.round(this.temp.day) + '&deg;C'
            );
        });

        data.list.shift(); // видаляємо перший день з масива по дням

        // будуємо таблицю для кожного наступного дня
        $.each(data.list, function(){
            addBriefWeatherTable(this);
        });

        $('#location').html(city + ', <b>' + country + '</b>'); // Додаємо локацію на сторінку
    }

    function getDayFromDt(dt, format) {
        var offset = (new Date()).getTimezoneOffset()*60*1000; // Відхилення від UTC  в мілісекундах
        var localTime = new Date(dt*1000 - offset); // конвертуємо час з UTC у локальний

        if (typeof format != 'undefined') {
            return moment(localTime).format(format);
        }

        return moment(localTime).calendar(); // Використовуємо moment.js для представлення дати
    }

    function addWeather(icon, day, condition, temp){
        var markup = '<tr>'+
                '<td>' + day + '</td>' +
                '<td>' + '<img src="images/icons/'+ icon +'.png" />' + '</td>' +
                '<td>' + temp + '</td>' +
                '<td>' + condition + '</td>'
            + '</tr>';
        //weatherTable.insertRow(-1).innerHTML = markup; // Додаємо рядок до таблиці
    }

    function addBriefWeatherTable(dayData) {
        var weekWrapper = $('.week'),
            dayTable = $('<table/>').addClass('tabl_mal1').attr({'align': 'center', 'width': 200, 'bgcolor': '#ffcc00'}),
            row;

        row = $('<tr/>');
        row.append($('<td/>').attr('height', 50).html(getDayFromDt(dayData.dt, 'ddd')));
        row.append($('<td/>').html(getDayFromDt(dayData.dt, 'L')));
        dayTable.append(row);

        row = $('<tr/>').attr('align', 'center');
        row.append($('<td/>').attr('height', 50).html(
            $('<img/>').attr('src', 'images/icons/'+ dayData.weather[0].icon +'.png' ))
        );
        row.append($('<td/>').attr('height', 50).html(dayData.weather[0].description));
        dayTable.append(row);

        row = $('<tr/>').attr('align', 'center');
        row.append($('<td/>').attr({'height': 50, 'colspan': 2}).html(Math.round(dayData.temp.day) + '&deg;C'));
        dayTable.append(row);

        weekWrapper.append(dayTable);
    }


    function showError(msg){
        $('#error').html('Сталася помилка: ' + msg);
    }
});