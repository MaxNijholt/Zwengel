var authServices = angular.module('authServices', ['ngResource']);

var services_auth = {};
var dataCaller_auth = {};

services_auth.Authentication = function($http, $rootScope) {
    var self = this;
    
    self.Login = function (username, password, onSucces) {
        dataCaller_auth.login($http, username, password, onSucces);
    };
    
    self.logout = function () {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        $rootScope.loggedin = false;
    }
    
    self.GetToken = function (callback) {
        var token = localStorage.getItem('token');
        callback(token);
    }

    self.GetId = function() {
        return localStorage.getItem('id');
    };

    self.SetCredentials = function (response, input) {
        localStorage.removeItem("token");

        localStorage.setItem('username', JSON.stringify(input.username));

        if (input.rememberme) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', response.data.id);
        }
        
        $rootScope.token = response.data.token;
        $rootScope.id = response.data.id;
        $rootScope.loggedin = true;
        $rootScope.username = input.username;
    };
    
    return {
        Login: self.Login,
        logout: self.logout,
        GetToken: self.GetToken,
        GetId: self.GetId,
        SetCredentials: self.SetCredentials
    };
};

dataCaller_auth.login = function($http, username, password, onSucces) {
    $http.post(API.base + API.login, { username: username, password: password })
        .success(
            function (response) {
                onSucces(response);
            }
        );
};

authServices.factory('Authentication', services_auth.Authentication);