var authServices = angular.module('authServices', ['ngResource']);

var services_auth = {};

services_auth.Authentication = function($http, $rootScope) {
    var self = this;
    
    self.Login = function (username, password, callback) {
        $http.post('https://zwengel-server.herokuapp.com/auth/login', { username: username, password: password })
            .success(function (response) {
                callback(response);
            });
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
    
    self.SetCredentials = function (response, input) {
        localStorage.setItem('username', JSON.stringify(input.username));

        if (input.rememberme) {
            localStorage.setItem('token', response.data.token);
            console.log("set token through local storage");
        }
        $rootScope.loggedin = true;
        $rootScope.username = input.username;
    };
    
    return {
        Login: self.Login,
        logout: self.logout,
        GetToken: self.GetToken,
        SetCredentials: self.SetCredentials
    };
};

authServices.factory('Authentication', services_auth.Authentication);