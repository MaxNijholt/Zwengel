require('angular-route/angular-route');

var app = angular.module('zwengelApp', ['ngRoute', 'ionic']);

app.factory('AllData', [require('./app.service.js')]);
app.service('DoelenService', ['$http', require('./doelen/doelen.service.js')]);

app.controller('AllController', ['$window', '$ionicPlatform', 'AllData', require('./app.controller.js')]);
app.controller('DoelenController', ['$ionicScrollDelegate', 'AllData', 'DoelenService', require('./doelen/doelen.controller.js')]);
app.controller('DoelController', ['$ionicScrollDelegate', '$routeParams', 'AllData', 'DoelenService', require('./doelen/doel.controller.js')]);

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