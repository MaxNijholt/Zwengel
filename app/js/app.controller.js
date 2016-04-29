module.exports = function($window, AllData) {
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
    
    // $ionicPlatform.registerBackButtonAction(function () {
	// 	AllData.toBack(true);
	// }, 100);
};