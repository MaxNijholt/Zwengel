var zwengelApp = angular.module('zwengelApp', [
    'ngRoute',
    'zwengelControllers',
    'zwengelServices',
    'dataServices',
    'authServices',
    'ionic'
]);

zwengelApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/doelen', {
                templateUrl: 'views/doelen.html',
                controller: 'DoelenController as denc',
                authenticate: true
            }).
            when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController as lc',
                authenticate: false
            }).
            when('/doelen/:doelID', {
                templateUrl: 'views/doel.html',
                controller: 'DoelController as dc',
                authenticate: true
            }).
            when('/beloningen', {
                templateUrl: 'views/beloningen.html',
                controller: 'BeloningenController as benc',
                authenticate: true
            }).
            when('/profiel', {
                templateUrl: 'views/profiel.html',
                controller: 'ProfielController as pc',
                authenticate: true
            }).
            otherwise({
                redirectTo: '/login',
                authenticate: false
            });
    }
]);

zwengelApp.run(["$rootScope", "$location", "Authentication", function ($rootScope,
    $location, Authentication) {

    if (localStorage.getItem("token") != null) {
        $rootScope.loggedin = true;
        $rootScope.token = localStorage.getItem("token");
    }

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.$$route != undefined)
            if (next.$$route.authenticate)
                if (!$rootScope.loggedin) {
                    event.preventDefault();
                    $location.path('/login');
                }
    });
}]);


zwengelApp.factory('httpRequestInterceptor', function ($rootScope) {
    return {
        request: function (config) {            
            config.headers['x-token'] = $rootScope.token;            
            return config;
        }
    }
});

zwengelApp.config(function ($httpProvider) { $httpProvider.interceptors.push('httpRequestInterceptor'); });
