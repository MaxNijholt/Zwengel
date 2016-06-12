var dataServices = angular.module('dataServices', ['ngResource']);

var API = {
    base: "http://kuipers.solutions:3000",
    login: "/auth/login",
    goals: "/goals",
    steps: "/steps",
    users: "/users",
    profile: "/auth/users/current"
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

    self.getBeloningen = function (studentID, onSucces) {
        dataCaller_data.getBeloningen(studentID, onSucces);
    };

    self.getProfile = function (studentID, onSucces, onFail) {
        dataCaller_data.getProfile($http, studentID, onSucces, onFail);
    };

    self.updatePreferences = function (studentID, preferences, onSucces, onFail) {
        dataCaller_data.updatePreferences($http, studentID, preferences, onSucces, onFail);
    };

    return {
        getDoelen: self.getDoelen,
        getDoel: self.getDoel,
        getStap: self.getStap,
        getProfile: self.getProfile,
        updatePreferences : self.updatePreferences
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
            onSucces(results.data);
        }, function (response) {
            onFail(response);
        });
}

dataCaller_data.getStap = function ($http, studentID, doelID, stapID, onSucces) {
    var stap = null;

    $http.get(API.base + API.goals + "/" + doelID + API.steps + "/" + stapID)
        .then(
        function (results) {
            onSucces(results.data);
        }, function (response) {
            onFail(response);
        });
};

dataCaller_data.getProfile = function ($http, studentID, onSucces, onFail) {
    $http.get(API.base + API.profile)
        .then(
        function (results) {
            onSucces(results.data);
        }, function (response) {
            onFail(response);
        });
};

dataCaller_data.updatePreferences = function ($http, studentID, preferences, onSucces, onFail) {    
    console.log(preferences);
    $http.put(API.base + API.users + "/" + studentID, preferences)
        .then(function (result) {
            onSucces(result.data);
        }, function (error) {
            onFail(error);
        });
};

dataServices.factory('StudentInfo', ['$http', services_data.StudentInfo]);