var dataServices = angular.module('dataServices', ['ngResource']);

var API = {
    base: "http://localhost:5000",
    // base: "http://kuipers.solutions:3000",
    login: "/auth/login",
    goals: "/goals",
    steps: "/steps",
    users: "/users",
    profile: "/auth/users/current"
};

var services_data = {};
var dataCaller_data = {};

services_data.StudentInfo = function ($http, Authentication) {
    var self = this;

    self.getDoelen = function (onSucces) {
        var studentID = Authentication.GetId();
        dataCaller_data.getDoelen($http, studentID, onSucces);
    };

    self.getDoel = function (studentID, doelID, onSucces) {
        dataCaller_data.getDoel($http, studentID, doelID, onSucces);
    };

    self.updateMotivation = function (studentID, doelID, motivation, onSuccess, onFail) {
        dataCaller_data.updateMotivation($http, studentID, doelID, motivation, onSuccess, onFail);
    }

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
        updateMotivation: self.updateMotivation,
        getStap: self.getStap,
        getProfile: self.getProfile,
        updatePreferences: self.updatePreferences
    };
};

dataCaller_data.getDoelen = function ($http, studentID, onSucces, onFail) {
    var url = API.base + API.users + '/' + studentID + API.goals;
    console.log(url);

    $http.get(url)
        .then(
        function (results) {
            onSucces(results.data.data);
        }, function (response) {
            console.log(response);
        });
};

dataCaller_data.getDoel = function ($http, studentID, doelID, onSucces, onFail) {
    var doel = null;

    var url = API.base + API.users + '/' + studentID + API.goals + "/" + doelID;
    console.log(url);

    $http.get(API.base + API.users + '/' + studentID + API.goals + "/" + doelID)
        .then(
        function (results) {
            onSucces(results.data);
        }, function (response) {
            onFail(response);
        });
}

dataCaller_data.updateMotivation = function ($http, studentID, doelID, motivation, onSuccess, onFail) {
    $http.put(API.base + API.users + '/' + studentId + API.goals + "/" + doelID, motivation)
        .then(function (result) {
            onSuccess(result.data);
        }, function (error) {
            onFail(error);
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
    $http.put(API.base + API.users + "/" + studentID, preferences)
        .then(function (result) {
            onSucces(result.data);
        }, function (error) {
            onFail(error);
        });
};

dataServices.factory('StudentInfo', ['$http', 'Authentication', services_data.StudentInfo]);