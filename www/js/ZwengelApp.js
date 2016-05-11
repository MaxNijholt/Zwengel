var zwengelApp = angular.module('zwengelApp', [
    'ngRoute',
    'zwengelControllers',
    'zwengelServices',
    'dataServices',
    'loginService',
    'ionic'
]);

zwengelApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController as lc'
            }).
            when('/doelen', {
                templateUrl: 'views/doelen.html',
                controller: 'DoelenController as denc'
            }).
            when('/doelen/:doelID', {
                templateUrl: 'views/doel.html',
                controller: 'DoelController as dc'
            }).
            when('/doelen/:doelID/:stapID', {
                templateUrl: 'views/stap.html',
                controller: 'StapController as sc'
            }).
            when('/beloningen', {
                templateUrl: 'views/beloningen.html',
                controller: 'BeloningenController as benc'
            }).
            when('/profiel', {
                templateUrl: 'views/profiel.html',
                controller: 'ProfielController as pc'
            }).
            otherwise({
                redirectTo: '/login'
            });
    }
]);