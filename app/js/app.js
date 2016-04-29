require('angular/angular');
require('angular-route/angular-route');

var app = angular.module('zwengelApp', ['ngRoute']);

app.service('AllData', [require('./app.service.js')]);

app.controller('AllController', ['$window', 'AllData', require('./app.controller.js')]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
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
        	redirectTo: '/doelen'
        });
    }
]);