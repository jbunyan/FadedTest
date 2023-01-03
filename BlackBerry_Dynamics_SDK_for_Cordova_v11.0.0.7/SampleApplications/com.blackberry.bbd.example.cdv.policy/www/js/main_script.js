/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 */

APP = {
    'thisAppId': 'com.blackberry.bbd.example.cdv.policy',
    'about': null,
    'cityCodes': null,
    'cities': null,
    'timeFormat': null,
    'version': null,
    'serviceProviders': null,
    'ownServiceProvider': null,
    'serviceUrl': null
};

APP.syncPolicy = function() {
    var successCallback = function(policy) {
        APP.about = policy.about.WelcomeText;
        APP.cityCodes = policy.citiesdisplay.cities;
        APP.timeFormat = policy.citiesdisplay.timeFormat;
        APP.version = policy.version;
        APP.cities = [];

        APP.serviceUrl = 'https://' + APP.ownServiceProvider.serverCluster[0].server + '/maps/api/timezone/';

        for (var i = 0; i < APP.cityCodes.length; i++) {
            switch (APP.cityCodes[i]) {
                case '28S':
                    APP.cities[i] = {
                        'name': 'Sunnyvale',
                        'time': APP.getTime('Sunnyvale'),
                        'lat': 37.3711,
                        'long': 122.0375
                    };
                    APP.getTimeZone(APP.cities[i]);
                    break;
                case 'LHR':
                    APP.cities[i] = {
                        'name': 'London',
                        'time': APP.getTime('London'),
                        'lat': 51.5072,
                        'long': 0.1275
                    };
                    APP.getTimeZone(APP.cities[i]);
                    break;
                case 'LWO':
                    APP.cities[i] = {
                        'name': 'Lviv',
                        'time': APP.getTime('Lviv'),
                        'lat': 49.8500,
                        'long': 24.0167
                    };
                    APP.getTimeZone(APP.cities[i]);
                    break;
            }
        }

        setTimeout(function() {
            APP.updateUI();
        }, 500);
    };
    var errorCallback = function(error) {
        alert(error);
    };

    window.plugins.GDSpecificPolicies.updatePolicy(successCallback, errorCallback);
};

APP.updateUI = function() {
    $('.policy-page .about h2').empty();
    $('.policy-page .about').append('</b><h2>' + APP.about + '</h2>');
    $('.policy-page .timer').empty();
    $('.policy-page .timer').html('<h1>Time format</h1><p class="separator">' + APP.timeFormat + '</p>');

    for (var i = 0; i < APP.cities.length; i++) {

        var time = APP.cities[i].time ? APP.cities[i].time : 'not available';
        var timeZoneId = APP.cities[i].timeZoneId ? APP.cities[i].timeZoneId : 'not available';
        var timeZoneName = APP.cities[i].timeZoneName ? APP.cities[i].timeZoneName : 'not available';

        $('.policy-page .timer')
            .append('<h1>Current time in ' + APP.cities[i].name + '</h1><p>' + time + '</p>')
            .append('<h1>Time zone Id in ' + APP.cities[i].name + '</h1><p>' + timeZoneId + '</p>')
            .append('<h1>Time zone name in ' + APP.cities[i].name + '</h1><p class="separator">' + timeZoneName + '</p>');
    }

    $('.policy-page .timer').append('<h1>Policy version</h1><p id="policy-version">' + APP.version + '</p>');

    if (APP.ownServiceProvider) {
        $('.policy-page .service-info')
            .append('<h1>Service Provider ID</h1><p>' + APP.ownServiceProvider.identifier + '</p>');
        $('.policy-page .service-info')
            .append('<h1>Service Provider version</h1><p>' + APP.ownServiceProvider.version + '</p>');
        $('.policy-page .service-info')
            .append('<h1>Service Provider name</h1><p>' + APP.ownServiceProvider.name + '</p>');

        var serversCount = APP.ownServiceProvider.serverCluster.length;
        $('.policy-page .service-info')
            .append('<h1>Available servers</h1>');
        var servers = $('<p></p>');
        for (var i = 0; i < serversCount; i++) {
            if (serversCount > 0) {
                servers.append((i + 1) + '. ' + APP.ownServiceProvider.serverCluster[i].server +
                        ' on port ' + APP.ownServiceProvider.serverCluster[i].port + '</br>');
            } else {
                servers.append('No servers available.');
            }
        }
        $('.policy-page .service-info').append(servers);

        var servicesCount = APP.ownServiceProvider.services.length;
        $('.policy-page .service-info')
            .append('<h1>Available services</h1>');

        var services = $('<p></p>');
        for (var i = 0; i < servicesCount; i++) {
            if (servicesCount > 0) {
                services.append((i + 1) + '. ' + APP.ownServiceProvider.services[i].identifier + '</br>');
            } else {
                services.append('No services available.');
            }
        }
        $('.policy-page .service-info').append(services);

    } else {
        $('.policy-page .service-info').append('<p>No services available.</p>');
    }

    $('.policy-page .service-info p:last').attr('id', 'available-services');
};

APP.getTime = function(city) {
    var date = new Date(),
        dateToString = date.toString(),
        summertimeUtcDiff = 0;

    if (dateToString.includes('Summer Time') || dateToString.includes('ST')) {
        summertimeUtcDiff = 1;
    }

    var citiesUtcOffset = {
        'Sunnyvale': -8 + summertimeUtcDiff,
        'London': 0 + summertimeUtcDiff,
        'Lviv': 2 + summertimeUtcDiff
    };

    function getCityLocalTime(currentDate, cityUtcOffset) {
        var currentUtcDate = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60 * 1000);

        return new Date(currentUtcDate + (60 * 60 * 1000 * cityUtcOffset));
    }

    function formatAMPM(date) {
        var hours = date.getHours(),
            minutes = date.getMinutes(),
            ampm = '';

        if (APP.timeFormat == '12') {
            ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
        }

        minutes = minutes < 10 ? '0' + minutes : minutes;
        strTime = hours + ':' + minutes + ' ' + ampm;

        return strTime;
    }

    return formatAMPM(getCityLocalTime(date, citiesUtcOffset[city]));
};

APP.getServerSideServices = function() {
    var gerServicesError = function(error) {
        alert(error);
    };
    var getServicesSuccess = function(services) {
        APP.serviceProviders = services.serviceProviders;

        for (var i = 0; i < APP.serviceProviders.length; i++) {
            if (APP.serviceProviders[i].identifier == APP.thisAppId) {
                APP.ownServiceProvider = APP.serviceProviders[i];
            }
        }
    };

    window.plugins.GDServerSideServices.callGDServerSideService("com.blackberry.example.gdservice.time-zone",
        "1.0.0.0", getServicesSuccess, gerServicesError);
};

APP.getTimeZone = function(city) {
    var requestUrl = APP.serviceUrl + 'json?location=' + city.lat + ',' + city.long + '&timestamp=1331161200&sensor=false';
    var xhr = new XMLHttpRequest();

    xhr.open("GET", requestUrl, false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var obj = JSON.parse(xhr.responseText);
            city['timeZoneId'] = obj.timeZoneId;
            city['timeZoneName'] = obj.timeZoneName;
        }
    };
    xhr.send();
};

APP.showNoConnectionMsg = function() {
    var aboutDiv = $('.about'),
        timerDiv = $('.timer'),
        servicesDiv = $('.service-info');

    aboutDiv.html('<h3>Data is not available. Please check your internet connection.</h3>');
    timerDiv.html('');
    servicesDiv.html('<h3>Data is not available. Please check your internet connection.</h3>');
};

APP.onDeviceReady = function() {
    APP.getServerSideServices();
    APP.syncPolicy();
};
