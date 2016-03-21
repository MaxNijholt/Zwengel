var zwengelControllers = angular.module('zwengelControllers', []);
var controllers = {};

controllers.AllController = function($scope, $ionicPlatform, $window, AllData) {
    $scope.page = AllData.page;
    
    $scope.navDoelen = function(){
        AllData.toPage("Doelen", "#/doelen");
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

controllers.DoelenController = function($scope, $ionicScrollDelegate, AllData, StudentInfo) {
    $ionicScrollDelegate.scrollTop();
    
    StudentInfo.getDoelen("test", function(results){
        results.forEach(function(object){
            switch(object.done) {
                case "good":
                    object.doneColor = "balanced";
                    break;
                case "bad":
                    object.doneColor = "assertive";
                    break;
                default:
                    object.doneColor = "positive";
            }
        });
        $scope.targets = results;
    });
    
    $scope.toDoel = function(doelID){
        AllData.toPage("Doel", "#/doelen/" + doelID);
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
    
    $scope.doelscreen = AllData.pref.doelscreen;
    $scope.textIcons = AllData.pref.textIcons;
    $scope.thema = "default";
};

controllers.DoelController = function($scope, $ionicScrollDelegate, $routeParams, AllData, StudentInfo) {
    $ionicScrollDelegate.scrollTop();
    var doelID;
    
    StudentInfo.getDoel("test", $routeParams.doelID, function(results){
        results.steps.forEach(function(object){
            switch(object.done) {
                case "good":
                    object.doneColor = "balanced";
                    break;
                case "bad":
                    object.doneColor = "assertive";
                    break;
                default:
                    object.doneColor = "positive";
            }
        });
        
        $scope.doel = results;
        doelID = results.id;
    });
    
    $scope.toStap = function(stapID){
        AllData.toPage("Stap", "#/doelen/" + doelID + "/" + stapID);
    };
};

controllers.StapController = function($scope, $ionicScrollDelegate, $routeParams, AllData, StudentInfo) {
    $ionicScrollDelegate.scrollTop();
    
    StudentInfo.getStap("test", $routeParams.doelID, $routeParams.stapID, function(result){
        switch(result.done) {
                case "good":
                    result.doneColor = "balanced";
                    break;
                case "bad":
                    result.doneColor = "assertive";
                    break;
                default:
                    result.doneColor = "positive";
            }
        $scope.stap = result;
    });
};

zwengelControllers.controller('AllController', ['$scope', '$ionicPlatform', '$window', 'AllData', controllers.AllController]);
zwengelControllers.controller('DoelenController', ['$scope', '$ionicScrollDelegate', 'AllData', 'StudentInfo', controllers.DoelenController]);
zwengelControllers.controller('BeloningenController', ['$scope', '$ionicScrollDelegate', 'StudentInfo', controllers.BeloningenController]);
zwengelControllers.controller('ProfielController', ['$scope', '$ionicScrollDelegate', 'AllData', controllers.ProfielController]);
zwengelControllers.controller('DoelController', ['$scope', '$ionicScrollDelegate', '$routeParams', 'AllData', 'StudentInfo', controllers.DoelController]);
zwengelControllers.controller('StapController', ['$scope', '$ionicScrollDelegate', '$routeParams', 'AllData', 'StudentInfo', controllers.StapController]);