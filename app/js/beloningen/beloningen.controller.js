module.exports = function($ionicScrollDelegate, BeloningenService) {
    var self = this;
    
    $ionicScrollDelegate.scrollTop();
    
    self.hideFilter = "ng-hide";
	self.filterIcon = "ion-chevron-down";
    
    BeloningenService.getBeloningen("test" , function(results){
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