var zwengelControllers = angular.module('zwengelControllers', []);
var controllers = {};

controllers.AllController = function($scope, $ionicPlatform, $window, AllData) {
    $scope.page = AllData.page;
    
    $scope.navTijdlijn = function(){
        AllData.pushHistory(AllData.page.title, AllData.page.url);
        AllData.page.title = "Tijdlijn";
        AllData.page.url = "#/tijdlijn";
        window.location.replace("#/tijdlijn");
    };
    
    $scope.navBeloningen = function(){
        AllData.pushHistory(AllData.page.title, AllData.page.url);
        AllData.page.title = "Beloningen";
        AllData.page.url = "#/beloningen";
        window.location.replace("#/beloningen");
    };
    
    $scope.navProfiel = function(){
        AllData.pushHistory(AllData.page.title, AllData.page.url);
        AllData.page.title = "Profiel";
        AllData.page.url = "#/profiel";
        window.location.replace("#/profiel");
    };
    
    $scope.back = function(){
		$window.history.back();
    };
    
    $ionicPlatform.registerBackButtonAction(function () {
		$window.history.back();
	}, 100);
};

controllers.TijdlijnController = function($scope, $ionicScrollDelegate, AllData, StudentInfo) {
    $ionicScrollDelegate.scrollTop();
    
    StudentInfo.getModules("test", function(results){
        $scope.targets = results;
    });
    
    $scope.toDoel = function(doel){
        AllData.pushHistory(AllData.page.title, AllData.page.url, doel); 
        AllData.page.title = "Doel";
        AllData.page.url = "#/doel";
        AllData.doel = doel;
        window.location.replace("#/doel");
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
    
    $scope.doel = AllData.doel;
    
    $scope.toStep = function(step){
        AllData.pushHistory(AllData.page.title, AllData.page.url, undefined, step);     
        AllData.page.title = "Stap";
        AllData.page.url = "#/step";
        AllData.step = step;
        window.location.replace("#/step");
    };
};

controllers.StepController = function($scope, $ionicScrollDelegate, AllData) {
    $ionicScrollDelegate.scrollTop();
    
    $scope.step = AllData.step;
};

zwengelControllers.controller('AllController', ['$scope', '$ionicPlatform', '$window', 'AllData', controllers.AllController]);
zwengelControllers.controller('TijdlijnController', ['$scope', '$ionicScrollDelegate', 'AllData', 'StudentInfo', controllers.TijdlijnController]);
zwengelControllers.controller('BeloningenController', ['$scope', '$ionicScrollDelegate', 'StudentInfo', controllers.BeloningenController]);
zwengelControllers.controller('ProfielController', ['$scope', '$ionicScrollDelegate', 'AllData', controllers.ProfielController]);
zwengelControllers.controller('DoelController', ['$scope', '$ionicScrollDelegate', 'AllData', controllers.DoelController]);
zwengelControllers.controller('StepController', ['$scope', '$ionicScrollDelegate', 'AllData', controllers.StepController]);