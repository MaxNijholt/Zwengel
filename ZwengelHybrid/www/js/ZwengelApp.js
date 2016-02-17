var zwengelApp = angular.module('zwengelApp', [
    'ngRoute',
    'zwengelControllers',
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
        otherwise({
        	redirectTo: '/tijdlijn'
        });
    }
]);