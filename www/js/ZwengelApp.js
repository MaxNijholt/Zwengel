var zwengelApp = angular.module('zwengelApp', [
    'ngRoute',
    'zwengelControllers',
    'zwengelServices',
    'dataServices',
    'ionic'
]);

zwengelApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/doelen', {
        	templateUrl: 'views/doelen.html',
        	controller: 'DoelenController'
        }).
        when('/doelen/:doelID', {
        	templateUrl: 'views/doel.html',
        	controller: 'DoelController'
        }).
        when('/doelen/:doelID/:stapID', {
        	templateUrl: 'views/stap.html',
        	controller: 'StapController'
        }).
        when('/voortgang', {
        	templateUrl: 'views/voortgang.html',
        	controller: 'VoortgangController'
        }).
        when('/beloningen', {
        	templateUrl: 'views/beloningen.html',
        	controller: 'BeloningenController'
        }).
        when('/profiel', {
        	templateUrl: 'views/profiel.html',
        	controller: 'ProfielController'
        }).
        otherwise({
        	redirectTo: '/doelen'
        });
    }
]);