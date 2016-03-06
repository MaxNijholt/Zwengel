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
        when('/tijdlijn', {
        	templateUrl: 'views/tijdlijn.html',
        	controller: 'TijdlijnController'
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
        when('/doel', {
        	templateUrl: 'views/doel.html',
        	controller: 'DoelController'
        }).
        when('/step', {
        	templateUrl: 'views/step.html',
        	controller: 'StepController'
        }).
        otherwise({
        	redirectTo: '/tijdlijn'
        });
    }
]);