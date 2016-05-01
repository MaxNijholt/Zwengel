module.exports = function($ionicScrollDelegate, $routeParams, AllData, DoelenService) {
    var self = this;
    
    $ionicScrollDelegate.scrollTop();
    var doelID;
    
    DoelenService.getDoel("test", $routeParams.doelID, function(results){
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