var zwengelControllers = angular.module('zwengelControllers', []);
var controllers = {};

controllers.AllController = function($scope, $ionicPlatform, $window, AllData) {
    
    $scope.page = AllData.page;
    
    $scope.navTijdlijn = function(){
        AllData.page.title = "Tijdlijn";
        window.location.replace("#/tijdlijn");
    }
    
    $scope.navBeloningen = function(){
        AllData.page.title = "Beloningen";
        window.location.replace("#/beloningen");
    }
    
    $scope.navProfiel = function(){
        AllData.page.title = "Profiel";
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
        $scope.targets = results;
    });
};

controllers.BeloningenController = function($scope) {
    
};

controllers.ProfielController = function($scope) {
    
};

zwengelControllers.controller('AllController', ['$scope', '$ionicPlatform', '$window', 'AllData', controllers.AllController]);
zwengelControllers.controller('TijdlijnController', ['$scope', 'StudentInfo', controllers.TijdlijnController]);
zwengelControllers.controller('BeloningenController', ['$scope', controllers.BeloningenController]);
zwengelControllers.controller('ProfielController', ['$scope', controllers.ProfielController]);