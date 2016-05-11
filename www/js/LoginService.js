angular.module('loginService', ['ngResource'])

    .factory('AuthenticationService', function ($http, $rootScope) {
        var service = {};

        service.Login = function (username, password, callback) {
          
            $http.post('https://zwengel-server.herokuapp.com/auth/login', { username: username, password: password })
                .success(function (response) {                                        
                    callback(response);
                });

        };

        service.GetToken = function (callback) {
            var token = localStorage.getItem('token');
            //var token = $cookies.get("token");
            callback(token);
        }

        service.SetCredentials = function (response, input) {
            localStorage.setItem('username', JSON.stringify(input.username));

            if (input.remember) {
                localStorage.setItem('token', response.data.token);
                // $cookies.put("token", response.data.token);
                // console.log("set the cookie");
                console.log("set token through local storage");
            }
            $rootScope.loggedin = true;
            $rootScope.username = input.username;
        };
        return service;
    });
  