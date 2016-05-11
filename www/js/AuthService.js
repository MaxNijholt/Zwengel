angular.module('authService', ['ngResource'])

    .factory('AuthenticationService', function ($http, $rootScope) {
        var service = {};

        service.Login = function (username, password, callback) {
            $http.post('https://zwengel-server.herokuapp.com/auth/login', { username: username, password: password })            
                .success(function (response) {
                    callback(response);
                });
        };
        
        service.logout = function(){
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            $rootScope.loggedin = false;        
        }

        service.GetToken = function (callback) {
            var token = localStorage.getItem('token');
            callback(token);
        }

        service.SetCredentials = function (response, input) {
            localStorage.setItem('username', JSON.stringify(input.username));                   

            if (input.rememberme) {
                localStorage.setItem('token', response.data.token);
                console.log("set token through local storage");
            }
            $rootScope.loggedin = true;
            $rootScope.username = input.username;
        };
        return service;
    });
