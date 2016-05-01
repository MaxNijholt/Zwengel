module.exports = function($ionicScrollDelegate, AllData, DoelenService) {
    var self = this;
    
    $ionicScrollDelegate.scrollTop();
    
    DoelenService.getDoelen("test", function(results){
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