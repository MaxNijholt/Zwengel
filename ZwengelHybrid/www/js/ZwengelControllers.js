var zwengelControllers = angular.module('zwengelControllers', []);
var controllers = {};

controllers.AllController = function($scope, $ionicPlatform, $window, AllData) {
    $scope.page = AllData.page;
    
    $scope.navTijdlijn = function(){
        AllData.toPage("Tijdlijn", "#/tijdlijn");
    };
    
    $scope.navBeloningen = function(){
        AllData.toPage("Beloningen", "#/beloningen");
    };
    
    $scope.navProfiel = function(){
        AllData.toPage("Profiel", "#/profiel");
    };
    
    $scope.back = function(){
		AllData.toBack();
    };
    
    $ionicPlatform.registerBackButtonAction(function () {
		AllData.toBack();
	}, 100);
};

controllers.TijdlijnController = function($scope, $ionicScrollDelegate, AllData, StudentInfo) {
    $ionicScrollDelegate.scrollTop();
    
    StudentInfo.getModules("test", function(results){
        $scope.targets = results;
    });
    
    $scope.toDoel = function(doel){
        AllData.toPage("Doel", "#/doel", doel);
    };
};

controllers.BeloningenController = function($scope, $ionicScrollDelegate, StudentInfo) {
    $ionicScrollDelegate.scrollTop();
    
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

controllers.ProfielController = function($scope, $ionicScrollDelegate, AllData) {
    $ionicScrollDelegate.scrollTop();
    
    $scope.choice = AllData.pref.doelscreen;
};

controllers.DoelController = function($scope, $ionicScrollDelegate, AllData) {
    $ionicScrollDelegate.scrollTop();
    
    $scope.doel = AllData.page.doel;
    
    $scope.toStep = function(step){
        AllData.toPage("Stap", "#/step", null, step);
    };
};

controllers.StepController = function($scope, $ionicScrollDelegate, AllData) {
    $ionicScrollDelegate.scrollTop();
    
    $scope.step = AllData.page.step;
};

zwengelControllers.controller('AllController', ['$scope', '$ionicPlatform', '$window', 'AllData', controllers.AllController]);
zwengelControllers.controller('TijdlijnController', ['$scope', '$ionicScrollDelegate', 'AllData', 'StudentInfo', controllers.TijdlijnController]);
zwengelControllers.controller('BeloningenController', ['$scope', '$ionicScrollDelegate', 'StudentInfo', controllers.BeloningenController]);
zwengelControllers.controller('ProfielController', ['$scope', '$ionicScrollDelegate', 'AllData', controllers.ProfielController]);
zwengelControllers.controller('DoelController', ['$scope', '$ionicScrollDelegate', 'AllData', controllers.DoelController]);
zwengelControllers.controller('StepController', ['$scope', '$ionicScrollDelegate', 'AllData', controllers.StepController]);