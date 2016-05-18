var zwengelControllers = angular.module('zwengelControllers', []);
var controllers = {};

controllers.AllController = function ($ionicPlatform, $window, AllData) {
    var self = this;

    self.page = AllData.page;

    self.navDoelen = function () {
        AllData.toPage("Doelen", "#/doelen");
    };

    self.navBeloningen = function () {
        AllData.toPage("Beloningen", "#/beloningen");
    };

    self.navProfiel = function () {
        AllData.toPage("Profiel", "#/profiel");
    };

    self.back = function () {
        AllData.toBack();
    };

    $ionicPlatform.registerBackButtonAction(function () {
        AllData.toBack(true);
    }, 100);
};

controllers.LoginController = function ($ionicScrollDelegate, $rootScope, $ionicPopup, AuthenticationService, AllData) {
    var self = this;
    $ionicScrollDelegate.scrollTop();

    if (localStorage.getItem("token") != null) {
        AllData.toPage("Doelen", "#/doelen");
    }
    else {
        AllData.toPage("Login", "#/login");
    }

    self.login = function (input) {
        AuthenticationService.Login(input.username, input.password, function (response) {
            if (response.success) {
                $ionicPopup.alert({
                    title: 'Inloggen gelukt',
                    template: 'Gelukt! U bent ingelogd en word nu doorgestuurd.'
                })
                    .then(function (res) {
                        AuthenticationService.SetCredentials(response, input);
                        AllData.toPage("Doelen", "#/doelen");
                        console.log("ingelogd!");
                    });
            }
            else {
                if (response.message === "invalid credentials")
                    $ionicPopup.alert({
                        title: 'Fout inloggen',
                        template: 'Gebruikersnaam en/of wachtwoord onjuist.'
                    });
                else
                    console.log(response.message);
            }
        })
    }
};

controllers.DoelenController = function ($ionicScrollDelegate, AllData, StudentInfo) {
    var self = this;

    $ionicScrollDelegate.scrollTop();

    StudentInfo.getDoelen("test", function (results) {
        // console.log(results);
        
        results.forEach(function(object){
            switch(object.state) {
                case "finished":
                    object.doneColor = "balanced";
                    break;
                case "doing":
                    object.doneColor = "positive";
                    break;
                default:
                    object.doneColor = "assertive";
            }
        });
        
        self.targets = results;
        
    });

    self.toDoel = function (doelID) {
        AllData.toPage("Doel", "#/doelen/" + doelID);
    };
};

controllers.BeloningenController = function ($ionicScrollDelegate, StudentInfo) {
    var self = this;

    $ionicScrollDelegate.scrollTop();

    self.hideFilter = "ng-hide";
    self.filterIcon = "ion-chevron-down";
    StudentInfo.getBeloningen("test", function (results) {
        self.rewards = results;
    });

    self.buyReward = function (reward) {
        var confirm = window.confirm("Koop beloning: " + reward.title);
        if (confirm == true) {
            alert("Gekocht");
        }
    };

    self.toggleHideFilter = function (bool) {
        if (self.hideFilter === "ng-hide" && !bool) {
            self.hideFilter = "ng-show";
            self.filterIcon = "ion-chevron-up";
        } else {
            self.hideFilter = "ng-hide";
            self.filterIcon = "ion-chevron-down";
        }
    };
};

controllers.ProfielController = function ($ionicScrollDelegate, $ionicPopup, AllData, AuthenticationService) {
    var self = this;

    $ionicScrollDelegate.scrollTop();

    self.doelscreen = AllData.pref.doelscreen;
    self.textIcons = AllData.pref.textIcons;
    self.thema = "default";

    self.logout = function () {
        AuthenticationService.logout();
        $ionicPopup.alert({
            title: 'Uitloggen gelukt',
            template: 'U bent uitgelogd en word nu doorgestuurd.'
        }).then(function () {
            AllData.toPage("Login", "#/login");
        });
    }
};

controllers.DoelController = function ($ionicScrollDelegate, $routeParams, AllData, StudentInfo) {
    var self = this;

    $ionicScrollDelegate.scrollTop();
    var doelID;
    
    //self.doeletje = $routeParams.doelID;

    StudentInfo.getDoel("test", $routeParams.doelID, function (results) {
        // results.steps.forEach(function (object) {
        //     switch (object.done) {
        //         case "good":
        //             object.doneColor = "balanced";
        //             break;
        //         case "bad":
        //             object.doneColor = "assertive";
        //             break;
        //         default:
        //             object.doneColor = "positive";
        //     }
        // });

        self.doel = results;
        doelID = results._id;
    });

    // self.toStap = function (stapID) {
    //     AllData.toPage("Stap", "#/doelen/" + doelID + "/" + stapID);
    // };
};

controllers.StapController = function ($ionicScrollDelegate, $routeParams, AllData, StudentInfo) {
    var self = this;

    $ionicScrollDelegate.scrollTop();

    StudentInfo.getStap("test", $routeParams.doelID, $routeParams.stapID, function (result) {
        switch (result.done) {
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
zwengelControllers.controller('LoginController', ['$ionicScrollDelegate', '$rootScope', '$ionicPopup', 'AuthenticationService', 'AllData', controllers.LoginController]);
zwengelControllers.controller('DoelenController', ['$ionicScrollDelegate', 'AllData', 'StudentInfo', controllers.DoelenController]);
zwengelControllers.controller('BeloningenController', ['$ionicScrollDelegate', 'StudentInfo', controllers.BeloningenController]);
zwengelControllers.controller('ProfielController', ['$ionicScrollDelegate', '$ionicPopup', 'AllData', 'AuthenticationService', controllers.ProfielController]);
zwengelControllers.controller('DoelController', ['$ionicScrollDelegate', '$routeParams', 'AllData', 'StudentInfo', controllers.DoelController]);
zwengelControllers.controller('StapController', ['$ionicScrollDelegate', '$routeParams', 'AllData', 'StudentInfo', controllers.StapController]);
