module.exports = function($ionicScrollDelegate, AllData) {
    var self = this;
    
    $ionicScrollDelegate.scrollTop();
    
    self.doelscreen = AllData.pref.doelscreen;
    self.textIcons = AllData.pref.textIcons;
    self.thema = "default";
};