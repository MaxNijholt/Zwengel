var dataServices = angular.module('dataServices', ['ngResource']);

var API = {
    base: "http://zwengel-server.herokuapp.com",
    login: "/auth/login",
    goals: "/goals",
    steps: "/steps"
};

var services_data = {};
var dataCaller_data = {};

services_data.StudentInfo = function ($http) {
    var self = this;

    self.getDoelen = function (studentID, onSucces) {
        dataCaller_data.getDoelen($http, studentID, onSucces);
    };

    self.getDoel = function (studentID, doelID, onSucces) {
        dataCaller_data.getDoel($http, studentID, doelID, onSucces);
    };

    self.getStap = function (studentID, doelID, stapID, onSucces) {
        dataCaller_data.getStap(studentID, doelID, stapID, onSucces);
    };

    self.getBeloningen = function (studentID, onSucces) {
        dataCaller_data.getBeloningen(studentID, onSucces);
    };

    return {
        getDoelen: self.getDoelen,
        getDoel: self.getDoel,
        getStap: self.getStap,
        getBeloningen: self.getBeloningen
    };
};

dataCaller_data.getDoelen = function ($http, studentID, onSucces, onFail) {
    $http.get(API.base + API.goals)
        .then(
        function (results) {
            onSucces(results.data.data);
        }, function (response) {
            console.log(response);
        });
};

dataCaller_data.getDoel = function ($http, studentID, doelID, onSucces, onFail) {
    var doel = null;

    $http.get(API.base + API.goals + "/" + doelID)
        .then(
        function (results) {
            console.log(results.data);
            onSucces(results.data);
        }, function (response) {
            onFail(response);
        });
}

dataCaller_data.getStap = function (studentID, doelID, stapID, onSucces) {
    var stap = null;

    dataCaller_data.testResult.forEach(function (object) {
        if (object.id === doelID) {
            object.steps.forEach(function (object2) {
                if (object2.id === stapID) {
                    stap = object2;
                }
            });
        }
    });

    onSucces(stap);
};

dataCaller_data.getBeloningen = function (studentID, onSucces) {
    var testResult = [{
        "title": "10 min. spelletje spelen in de les",
        "price": 5,
        "behaald": true
    }, {
            "title": "15 min. spelletje spelen in de les",
            "price": 7,
            "behaald": false
        }, {
            "title": "Thema Ridder",
            "price": 25,
            "behaald": false
        }, {
            "title": "Thema Koning",
            "price": 25,
            "behaald": true
        }, {
            "title": "Als eerste naar huis",
            "price": 10,
            "behaald": false
        }
    ];

    onSucces(testResult);
};

dataServices.factory('StudentInfo', ['$http', services_data.StudentInfo]);