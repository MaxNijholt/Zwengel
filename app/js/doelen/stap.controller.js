module.exports = function($ionicScrollDelegate, $routeParams, AllData, DoelenService) {
    var self = this;
    
    $ionicScrollDelegate.scrollTop();
    
    DoelenService.getStap("test", $routeParams.doelID, $routeParams.stapID, function(result){
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