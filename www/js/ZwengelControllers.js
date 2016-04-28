var zwengelControllers = angular.module('zwengelControllers', []);
var controllers = {};

controllers.AllController = function($ionicPlatform, $window, AllData) {
    var self = this;
    
    self.page = AllData.page;
    
    self.navDoelen = function(){
        AllData.toPage("Doelen", "#/doelen");
    };
    
    self.navBeloningen = function(){
        AllData.toPage("Beloningen", "#/beloningen");
    };
    
    self.navProfiel = function(){
        AllData.toPage("Profiel", "#/profiel");
    };
    
    self.back = function(){
		AllData.toBack();
    };
    
    $ionicPlatform.registerBackButtonAction(function () {
		AllData.toBack(true);
	}, 100);
};

controllers.DoelenController = function($ionicScrollDelegate, AllData, StudentInfo) {
    var self = this;
    
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
        self.targets = results;
    });
    
    self.toDoel = function(doelID){
        AllData.toPage("Doel", "#/doelen/" + doelID);
    };
};

controllers.BeloningenController = function($ionicScrollDelegate, StudentInfo) {
    var self = this;
    
    $ionicScrollDelegate.scrollTop();
    
    self.hideFilter = "ng-hide";
	self.filterIcon = "ion-chevron-down";
    StudentInfo.getBeloningen("test" , function(results){
        self.rewards = results;
    });
    	
    self.buyReward = function(reward){
        var confirm = window.confirm("Koop beloning: " + reward.title);
        if (confirm == true) {
            alert("Gekocht");
        }
    };
        
	self.toggleHideFilter = function(bool){
		if(self.hideFilter === "ng-hide" && !bool){
			self.hideFilter = "ng-show";
			self.filterIcon = "ion-chevron-up";
		}else{
			self.hideFilter = "ng-hide";
			self.filterIcon = "ion-chevron-down";
		}
	};
};

controllers.ProfielController = function($ionicScrollDelegate, AllData) {
    var self = this;
    
    $ionicScrollDelegate.scrollTop();
    
    self.doelscreen = AllData.pref.doelscreen;
    self.textIcons = AllData.pref.textIcons;
    self.thema = "default";
};

controllers.DoelController = function($ionicScrollDelegate, $routeParams, AllData, StudentInfo) {
    var self = this;
    
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
        
        self.doel = results;
        doelID = results.id;
    });
    
    self.toStap = function(stapID){
        AllData.toPage("Stap", "#/doelen/" + doelID + "/" + stapID);
    };
};

controllers.StapController = function($ionicScrollDelegate, $routeParams, AllData, StudentInfo) {
    var self = this;
    
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
        self.stap = result;
    });
};

zwengelControllers.controller('AllController', ['$ionicPlatform', '$window', 'AllData', controllers.AllController]);
zwengelControllers.controller('DoelenController', ['$ionicScrollDelegate', 'AllData', 'StudentInfo', controllers.DoelenController]);
zwengelControllers.controller('BeloningenController', ['$ionicScrollDelegate', 'StudentInfo', controllers.BeloningenController]);
zwengelControllers.controller('ProfielController', ['$ionicScrollDelegate', 'AllData', controllers.ProfielController]);
zwengelControllers.controller('DoelController', ['$ionicScrollDelegate', '$routeParams', 'AllData', 'StudentInfo', controllers.DoelController]);
zwengelControllers.controller('StapController', ['$ionicScrollDelegate', '$routeParams', 'AllData', 'StudentInfo', controllers.StapController]);