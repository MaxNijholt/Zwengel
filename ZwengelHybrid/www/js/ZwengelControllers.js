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

controllers.TijdlijnController = function($scope, AllData, StudentInfo) {
    StudentInfo.getModules("test", function(results){
        $scope.targets = results;
    });
    
    $scope.toDoel = function(doel){
        AllData.doel = doel;
        window.location.replace("#/doel");
    };
};

controllers.BeloningenController = function($scope, StudentInfo) {
    $scope.hideFilter = "ng-hide";
	$scope.filterIcon = "ion-chevron-down";
    StudentInfo.getBeloningen("test" , function(results){
        $scope.rewards = results;
    });
    
	
	$scope.toggleHideFilter = function(bool){
		if($scope.hideFilter === "ng-hide" && !bool){
			$scope.hideFilter = "ng-show";
			$scope.filterIcon = "ion-chevron-up";
		}else{
			$scope.hideFilter = "ng-hide";
			$scope.filterIcon = "ion-chevron-down";
		}
	};
};

controllers.ProfielController = function($scope) {
    
};

controllers.DoelController = function($scope, AllData) {
    $scope.doel = AllData.doel;
};

zwengelControllers.controller('AllController', ['$scope', '$ionicPlatform', '$window', 'AllData', controllers.AllController]);
zwengelControllers.controller('TijdlijnController', ['$scope', 'AllData', 'StudentInfo', controllers.TijdlijnController]);
zwengelControllers.controller('BeloningenController', ['$scope', 'StudentInfo', controllers.BeloningenController]);
zwengelControllers.controller('ProfielController', ['$scope', controllers.ProfielController]);
zwengelControllers.controller('DoelController', ['$scope', 'AllData', controllers.DoelController]);