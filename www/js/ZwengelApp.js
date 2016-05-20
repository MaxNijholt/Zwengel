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
            when('/doelen/:doelID/:stapID', {
                templateUrl: 'views/stap.html',
                controller: 'StapController as sc',
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
