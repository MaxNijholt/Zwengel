var zwengelControllers = angular.module('zwengelControllers', []);
var controllers = {};

controllers.AllController = function($scope, $ionicPlatform, $window) {
    
    $scope.title = "Tijdlijn";
    
    $scope.navTijdlijn = function(){
        $scope.title = "Tijdlijn";
        window.location.replace("#/tijdlijn");
    }
    
    $scope.navBeloningen = function(){
        $scope.title = "Beloningen";
        window.location.replace("#/beloningen");
    }
    
    $scope.navProfiel = function(){
        $scope.title = "Profiel";
        window.location.replace("#/profiel");
    }
    
    $scope.back = function(){
		$window.history.back();
    };
    
    $ionicPlatform.registerBackButtonAction(function () {
		$window.history.back();
	}, 100);
};

controllers.TijdlijnController = function($scope, StudentInfo) {
    StudentInfo.getModules("test", function(results){
        $scope.modules = results;
    });
};

controllers.BeloningenController = function($scope) {
    
};

controllers.ProfielController = function($scope) {
    
};

zwengelControllers.controller('AllController', ['$scope', '$ionicPlatform', '$window', controllers.AllController]);
zwengelControllers.controller('TijdlijnController', ['$scope', 'StudentInfo', controllers.TijdlijnController]);
zwengelControllers.controller('BeloningenController', ['$scope', controllers.BeloningenController]);
zwengelControllers.controller('ProfielController', ['$scope', controllers.ProfielController]);