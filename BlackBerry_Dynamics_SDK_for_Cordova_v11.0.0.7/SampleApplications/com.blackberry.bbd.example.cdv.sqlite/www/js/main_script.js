/**
 * (c) 2019 BlackBerry Limited. All rights reserved.
 *
 * @fileOverview SQLite sample application for BlackBerry Dynamics.
 *
 * @description SQLite sample application uses BlackBerry Dynamics (BBD) Plugin APIs such as GDStorage API.
 *
 * @version 1.0
 */

var APP = {
    errors: null,
    db: null
},
    config = {
        database: {
            name: "Database",
            version: "1.0",
            displayname: "Cordova Demo",
            size: 200000,
            success: null,
            error: function () {
                alert('Database can\'t be opened')
            }
        }
    };

_.extend(APP, Backbone.Events);

APP.errors = {
    executeSql: function () {
        alert('Can\'t execute SQL')
    }
};

/*
 * Application open database connection and fill with mock data
 */
APP.openDatabase = function (config) {

    APP.db = window.openDatabase(
        config.database.name,
        config.database.version,
        config.database.displayname,
        config.database.size,
        null,
        config.database.error);

    APP.db.transaction(function (tx) {
        
        setupFirstDataForApp();

        function setupFirstDataForApp () {

            setupFirstDataForDepartments();
            setupFirstDataForOffices();
            setupFirstDataForEmployees();
            
            function setupFirstDataForTable (tableName, cb) {
                APP.db.transaction(function (tx) {
                    tx.executeSql('SELECT name FROM sqlite_master WHERE type="table" AND name="' + tableName + '";',
                        [], function (tx, result) {
                            if (result.rows.length != 1) {
                                cb(tx);
                            }
                        }, APP.errors.executeSql);
                });
            }

            function setupFirstDataForDepartments () {
                setupFirstDataForTable('Departments', function (tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Departments( ' +
                        'id INTEGER PRIMARY KEY NOT NULL, ' +
                        'name VARCHAR(50) ); ', [], null, null);

                    tx.executeSql('INSERT INTO Departments (name) VALUES ("Finance");', [], null, APP.errors.executeSql);
                    tx.executeSql('INSERT INTO Departments (name) VALUES ("HR");', [], null, APP.errors.executeSql);
                    tx.executeSql('INSERT INTO Departments (name) VALUES ("IT");', [], null, APP.errors.executeSql);
                    tx.executeSql('INSERT INTO Departments (name) VALUES ("DEV TEAM");', [], null, APP.errors.executeSql);
                });
            }

            function setupFirstDataForOffices () {
                setupFirstDataForTable('Offices', function (tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Offices( ' +
                        'id INTEGER PRIMARY KEY NOT NULL, ' +
                        'name VARCHAR(50), ' +
                        'longitude FLOAT, ' +
                        'longitude_direction VARCHAR(10),' +
                        'latitude FLOAT, ' +
                        'latitude_direction VARCHAR(10) ) ; ', [], null, null);

                    tx.executeSql('INSERT INTO Offices (name, longitude, longitude_direction, latitude, latitude_direction) ' +
                        'VALUES ("Lviv", 49.8, "&deg;N",  24, "&deg;E");', [], null, APP.errors.executeSql);
                    tx.executeSql('INSERT INTO Offices (name, longitude, longitude_direction, latitude, latitude_direction) ' +
                        'VALUES ("NY", 40.7, "&deg;N", 74, "&deg;W");', [], null, APP.errors.executeSql);
                });
            }

            function setupFirstDataForEmployees () {
                setupFirstDataForTable('Employees', function (tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Employees( ' +
                        'id INTEGER PRIMARY KEY NOT NULL, ' +
                        'name VARCHAR(50), ' +
                        'office INTEGER, ' +
                        'department INTEGER, ' +
                        'FOREIGN KEY ( office ) REFERENCES Offices ( id ) ' +
                        'FOREIGN KEY ( department ) REFERENCES Departments ( id ) );', [], null, null);
                    
                    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Orest", 1,  4);',
                        [], null, APP.errors.executeSql);
                    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Rob", 2, 4);',
                        [], null, APP.errors.executeSql);
                    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Ihor", 1,  1);',
                        [], null, APP.errors.executeSql);
                    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Dmytro", 1, 3);',
                        [], null, APP.errors.executeSql);
                });
            }

        }
                       
    }, function () {
        alert('Can\'t complete SQL transaction');
    }, function () {
        APP.trigger('databaseReady');
    });
};

/*
 * Get all need information about list.
 * Can be send jQuery element - navigation element or name of the list
 */

APP.getListData = function (page) {
    if (_.isString(page)) {
        page = $('#container-list-wrapper .pageButton.' + page);
    }

    return {
        list: page.data('name'),
        title: page.data('title')
    }
};

/*
 * Hide all containers and show container with id - page
 */
APP.showPage = function (page) {
    var $page = $('#' + page);
    $('.page').addClass('d-none');
    $page.removeClass('d-none');
    return $page;
};

/*
 * View page that hold lists
 */
APP.viewList = function () {
    APP.showPage('container-list-wrapper');
};

/*
 * Loads list by id
 */
APP.loadList = function (e, flag) {
    var options;

    APP.viewList();

    if (flag != 'forceLoad') {
        var $el = $(e.currentTarget);

        options = APP.getListData($el);

        $('#container-list-wrapper .pageButton').removeClass('btn-active');

        $el.addClass('btn-active');

    } else {
        options = e;
    }

    APP.$els.title.html(options.list);

    APP.$els.headerEl.data('list', options.list);
    APP.$els.headerEl.data('title', options.title);

    APP.QuerySQLList(options);
};

/*
 * Query list to get all rows
 */
APP.QuerySQLList = function (options) {
    APP.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + options.list, [], function (tx, result) {
            APP.trigger('SQLListReady', result, options);
        }, null);
    });
};

/*
 * Render list and insert to page
 */
APP.renderList = function (results, options) {

    $('#list-container-list').empty();

    var len = results.rows.length;

    for (var i = 0; i < len; i++) {

        var row = results.rows.item(i);
        $('#list-container-list').append('<li><a href="#" class="details" data-title="' + options.title + '" data-list="' + options.list + '" data-name="' + row.name + '" data-id="' + row.id + '">' + row.name + '</a></li>');

    }

    $('#list-container-list').trigger('refresh');
    $('#list-container-list').listview('refresh');
};


/*
 * Turn on edit mode for list and render delete button
 */
APP.editList = function (e) {
    var $edit = $(e.currentTarget);
    if ($('#list-container-list li .delete-list-item').length) {
        $('.pageButton[data-name=' + $edit.data('list') + ']').trigger('touchstart');
    } else {
        var info = [];
        $('#list-container-list li .details').each(function () {
            el = $(this);
            info.push({
                name: el.data('name'),
                id: el.data('id'),
                list: el.data('list')
            })
        });

        $('#list-container-list').empty();

        for (var i = 0, m = info.length; i < m; i++) {
            $('#list-container-list').append('<li><a href="#">' + info[i].name + '</a><a href="#" class="delete-list-item" data-list="' + info[i].list + '" data-id="' + info[i].id + '"></a></li>');
        }
        $('#list-container-list').trigger('refresh');
        $('#list-container-list').listview('refresh');
    }
};

/*
 * Delete item from database and page individualy for each list
 */
APP.deleteItem = function (e) {
    var $deleteItem = $(e.currentTarget),
        list = $deleteItem.data('list'),
        id = $deleteItem.data('id'),
        success = function () {
            $deleteItem.closest('li').remove();
            $('#list-container-list').trigger('refresh');
            $('#list-container-list').listview('refresh');
        };

    if (list == 'departments') {
        APP.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM Employees WHERE department = ?', [id]);
            tx.executeSql('DELETE FROM Departments WHERE id = ?', [id]);
        }, APP.errors.executeSql, success);
    } else if (list == 'employees') {
        APP.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM Employees WHERE id = ?', [id]);
        }, APP.errors.executeSql, success);
    } else if (list == 'offices') {
        APP.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM Employees WHERE office = ?', [id]);
            tx.executeSql('DELETE FROM Offices WHERE id = ?', [id]);
        }, APP.errors.executeSql, success);
    }
};

/*
 * Get details from database and render them for each list
 */
APP.showDetailsAPI = {
    departments: function ($content, elID) {
        APP.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM DEPARTMENTS WHERE id=?', [elID], function (tx, results) {
                var row = results.rows.item(0);
                $content.append('<h1>Department name</h1>');
                $content.append('<p>' + row.name + '</p>');
            }, APP.errors.executeSql);

            tx.executeSql('SELECT * FROM EMPLOYEES WHERE department=?', [elID], function (tx, results) {
                var employessList = [],
                    row;
                if (results.rows.length) {
                    for (var i = 0, m = results.rows.length; i < m; i++) {
                        row = results.rows.item(i);

                        employessList.push(row.name);
                    }
                    $content.append('<h1>Employees</h1>');
                    $content.append('<p>' + employessList.join(', ') + '</p>');
                }
            }, APP.errors.executeSql);
        }, null, null);
    },

    employees: function ($content, elID) {
        var employee;
        APP.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM EMPLOYEES WHERE id=?', [elID], function (tx, results) {
                employee = results.rows.item(0);

                $content.append('<h1>Employee name</h1>');
                $content.append('<p>' + employee.name + '</p>');
            }, APP.errors.executeSql);
        }, null, function () {
            APP.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM OFFICES WHERE id=?', [employee.office], function (tx, office) {
                    if (office.rows.length) {
                        $content.append('<h1>Office</h1>');
                        $content.append('<p>' + office.rows.item(0).name + '</p>');
                    }
                }, APP.errors.executeSql);

                tx.executeSql('SELECT * FROM DEPARTMENTS WHERE id=?', [employee.department], function (tx, department) {
                    if (department.rows.length) {
                        $content.append('<h1>Department</h1>');
                        $content.append('<p>' + department.rows.item(0).name + '</p>');
                    }
                }, APP.errors.executeSql);
            }, null);
        });
    },

    offices: function ($content, elID) {
        APP.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM OFFICES WHERE id=?', [elID], function sucsess(tx, results) {
                var officeDetails = results.rows.item(0);
                $content.append('<h1>Location</h1>');
                $content.append('<span>Longitude: ' + officeDetails.longitude + officeDetails.longitude_direction + '</span></br>');
                $content.append('<p>Latitude: ' + officeDetails.latitude + officeDetails.latitude_direction + '</p>');
            }, APP.errors.executeSql);

            tx.executeSql('SELECT * FROM EMPLOYEES WHERE office=?', [elID], function sucsess(tx, results) {
                var employessList = [],
                    row;
                if (results.rows.length) {
                    for (var i = 0, m = results.rows.length; i < m; i++) {
                        row = results.rows.item(i);

                        employessList.push(row.name);
                    }

                    $content.append('<h1>Employees</h1>');
                    $content.append('<p>' + employessList.join(', ') + '</p>');
                }
            }, APP.errors.executeSql);
        }, null);
    }
};

/*
 * Show details handler
 */
APP.showDetails = function (e) {
    var $page = APP.showPage('container-details'),
        $content = $page.find('.content-details'),
        $el = $(e.currentTarget),
        elID = $el.data('id'),
        list = $el.data('list');

    $content.empty();

    $page.find('h1').html($el.data('title') + ' details');
    $page.find('#back-btn .ui-btn-text').text(list);

    APP.showDetailsAPI[list]($content, elID);
};
/*
 * Show new enry page handler
 */
APP.newEntryViewPage = function (e) {
    var $el = $(e.currentTarget),
        list = $el.data('list'),
        title = $el.data('title'),
        $page = APP.showPage('container-add'),
        content = $page.find('.content-add');

    APP.newEntry = list;

    $page.find('h1').html('New')
        .end()
        .find('#back-btn .ui-btn-text').text(list);

    APP.newEntryAPI[list].view(content);

    content.find('.add-name').text(title + ' name');
};

/*
 * Save entry handler
 */
APP.newEntrySave = function () {
    APP.newEntryAPI[APP.newEntry].save();
};

APP.preventZoom = function () {
    $.mobile.zoom.disable();
};

APP.newEntryAPI = {
    departments: {
        view: function (contentWrapper) {
            contentWrapper.html($('#departments-template').html()).trigger('create');
        },
        save: function () {
            var departmentName = $("#department_name").val();
            if (!APP.newEntryAPI.formValidator($("#department_name"))) return;
            APP.db.transaction(function (tx) {
                tx.executeSql('INSERT INTO Departments (name) VALUES (?);', [departmentName]);
            }, APP.errors.executeSql, function () {
                APP.loadList(APP.getListData(APP.newEntry), 'forceLoad');
            });
        }
    },
    offices: {
        view: function (contentWrapper) {
            contentWrapper.html($('#offices-template').html()).trigger('create');
        },
        save: function () {
            var officeName = $("#office_name").val(),
                officeLatitude = $("#latitude").val(),
                officeLatitudeDirection = $("#latitude-direction").val(),
                officeLongitude = $("#longitude").val(),
                officeLongitudeDirection = $("#longitude-direction").val();
            if (!APP.newEntryAPI.formValidator($("#office_name"))) return;

            APP.newEntryAPI.locationValidator($("#latitude"));
            APP.newEntryAPI.locationValidator($("#longitude"));

            if ($("#latitude").parents().hasClass("error-required") ||
                $("#longitude").parents().hasClass("error-required")) return;

            APP.db.transaction(function (tx) {
                tx.executeSql('INSERT INTO Offices (name, longitude, longitude_direction, latitude, latitude_direction)' +
                    ' VALUES (?, ?, ?, ?, ?);', [
                        officeName, officeLongitude, officeLongitudeDirection, officeLatitude, officeLatitudeDirection
                    ]);
            }, APP.errors.executeSql, function () {
                APP.loadList(APP.getListData(APP.newEntry), 'forceLoad');
            });
        }
    },
    employees: {
        view: function (contentWrapper) {

            contentWrapper.html($('#employees-template').html()).trigger('create');

            APP.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM Departments', [],
                    function (tx, results) {
                        var cases = [];

                        for (var i = 0, len = results.rows.length; i < len; i++) {
                            cases.push('<option value="' + results.rows.item(i).id + '">' + results.rows.item(i).name + '</option>');
                        }
                        contentWrapper.find('#department_select').append(cases.join(''));
                    });
                tx.executeSql('SELECT * FROM Offices', [],
                    function (tx, results) {

                        var cases = [];

                        for (var i = 0, len = results.rows.length; i < len; i++) {
                            cases.push('<option value="' + results.rows.item(i).id + '">' + results.rows.item(i).name + '</option>');
                        }
                        contentWrapper.find('#office_select').append(cases.join(''));
                    });
            }, APP.errors.executeSql);

            $("#department_select").trigger("change");
            $("#office_select").trigger("change");
        },
        save: function () {
            var employeeName = $("#employee_name").val(),
                selectedDepartment = $("#department_select").val(),
                selectedOffice = $("#office_select").val();
            if (!APP.newEntryAPI.formValidator($("#employee_name"))) return;
            APP.db.transaction(function (tx) {
                tx.executeSql('INSERT INTO Employees (name, office, department) VALUES (?, ?,  ?);', [employeeName, selectedOffice, selectedDepartment]);
            }, APP.errors.executeSql, function () {
                APP.loadList(APP.getListData(APP.newEntry), 'forceLoad');
            });
        }
    },
    formValidator: function (inputElement) {
        if (!inputElement.val().trim()) {
            alert('Please fill all field(s)!');
            return false;
        }
        return true;
    },
    locationValidator: function (inputElement) {
        var fieldValue = inputElement.val().trim(),
            validator = inputElement.attr("id") === "latitude" ?
                RegExp(/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,6})?|90(\.0{1,6})?)$/) :
                RegExp(/^[+-]?((([1-9]?[0-9]|1[0-7][0-9])(\.[0-9]{1,6})?)|180(\.0{1,6})?)$/);

        if (!fieldValue) {
            inputElement.parents(".required-field").addClass("error-required");
        } else {
            var result = parseFloat(fieldValue);
            if (Number.isNaN(result)) {
                inputElement.parents(".required-field").addClass("error-required");
            } else if (validator.test(result)) {
                inputElement.parents(".required-field").removeClass("error-required");
            } else {
                inputElement.parents(".required-field").addClass("error-required");
            }
        }
    }
};

APP.handleSelectButtonsEventListeners = function() {
    var SELECT_ELEMENTS_IDS = [
        '#department_select',
        '#office_select',
        '#latitude-direction',
        '#longitude-direction'
    ];

    for (var i = 0; i < SELECT_ELEMENTS_IDS.length; i++) {
        var selectButtonId = SELECT_ELEMENTS_IDS[i] + "-button";
        $(document).on('tap', selectButtonId, function(e) {
            if ($('#' + e.currentTarget.id).hasClass("ui-focus")) {
                e.preventDefault();
                $('#' + e.currentTarget.id.replace('-button', '')).trigger("blur");
            }
        });
    }
}

APP.deviceReady = function () {
    APP.$els = {
        title: $('#content-list-title'),
        edit: $('#edit-element'),
        add: $('#add-element'),
        headerEl: $('#edit-element, #add-element')
    };

    $(document).on('touchstart', '#container-list-wrapper .pageButton', _.bind(APP.loadList, this));
    $(document).on('touchstart', '#container-list-wrapper .details', _.bind(APP.showDetails, this));

    APP.listenTo(APP, 'databaseReady', function () {
        APP.loadList(APP.getListData('departments'), 'forceLoad');
    });

    APP.listenTo(APP, 'SQLListReady', _.bind(APP.renderList, APP));

    $(document).on('touchstart', '#edit-element', _.bind(APP.editList, APP));

    $(document).on('touchstart', '.delete-list-item', _.bind(APP.deleteItem, APP));

    $(document).on('touchstart', '#back-btn', _.bind(APP.viewList, this));

    $(document).on('touchstart', '#add-element', _.bind(APP.newEntryViewPage, this));

    $(document).on('touchstart', '#add-new-entry', _.bind(APP.newEntrySave, this));

    $(document).on('touchstart', 'body', _.bind(APP.preventZoom, this));

    APP.handleSelectButtonsEventListeners();

    APP.openDatabase(config);
};

document.addEventListener("deviceready", function () {
    $(function () {
        APP.deviceReady();
    });
}, false);
