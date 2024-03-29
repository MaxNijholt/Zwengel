var zwengelControllers = angular.module('zwengelControllers', []);
var controllers = {};

controllers.AllController = function ($ionicPlatform, $window, $route, AllData) {
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

    self.reload = function () {
        $route.reload();
    };

    $ionicPlatform.registerBackButtonAction(function () {
        AllData.toBack(true);
    }, 100);
};

controllers.LoginController = function ($ionicScrollDelegate, $rootScope, $ionicPopup, Authentication, AllData) {
    var self = this;
    $ionicScrollDelegate.scrollTop();

    if (localStorage.getItem("token") != null) {
        AllData.toPage("Doelen", "#/doelen");
    }
    else {
        AllData.toPage("Login", "#/login");
    }

    self.login = function (input) {
        Authentication.Login(input.username, input.password, function (response) {
            if (response.success) {
                Authentication.SetCredentials(response, input);
                AllData.toPage("Doelen", "#/doelen");
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

    StudentInfo.getDoelen(function (results) {

        results.forEach(function (object) {
            var progress = 0;
            object.steps.forEach(function (stap) {
                if (stap.completed) {
                    progress++;
                }
            });
            object.steps.progress = progress;
            object.steps.progressStyle = progress / object.steps.length * 100;
            switch (object.state) {
                case "doing":
                    object.doneColor = "positive";
                    break;
                case "finished":
                    object.doneColor = "balanced";
                    break;
                case "stopped":
                    object.doneColor = "dark";
            }
        });

        self.targets = results;

    });

    self.toDoel = function (doelID) {
        AllData.toPage("Doel", "#/doelen/" + doelID);
    };
};

controllers.ProfielController = function ($ionicScrollDelegate, $ionicPopup, AllData, Authentication, StudentInfo) {
    var self = this;

    $ionicScrollDelegate.scrollTop();

    //moet nog studentID ophalen
    StudentInfo.getProfile(0,
        function (result) {
            self.profile = result;
        }, function (error) {
            console.log(error);
        }
    );

    self.logout = function () {
        Authentication.logout();
        AllData.toPage("Login", "#/login");
    };
};

controllers.DoelController = function ($ionicScrollDelegate, $routeParams, $scope, $ionicPopup, AllData, StudentInfo, PopUps) {
    var self = this;

    $ionicScrollDelegate.scrollTop();
    var doelID;

    self.getDoel = function () {
        StudentInfo.getDoel($routeParams.doelID, function (results) {
            var progress = 0;
            results.steps.forEach(function (stap) {
                if (stap.completed) {
                    progress++;
                }
            });
            results.steps.progress = progress;
            results.steps.progressStyle = progress / results.steps.length * 100;

            switch (results.state) {
                case "doing":
                    results.doneColor = "positive";
                    break;
                case "finished":
                    results.doneColor = "balanced";
                    break;
                case "stopped":
                    results.doneColor = "dark";
            }

            results.steps.forEach(function (object) {
                switch (object.completed) {
                    case true:
                        object.doneColor = "balanced";
                        break;
                    default:
                        object.doneColor = "positive";
                }
            });

            self.doel = results;
            doelID = results._id;
        });
    }

    self.getDoel();

    self.editMotivation = function (currentMotivation) {
        $scope.popupData = {};
        $scope.popupData.motivation = currentMotivation;

        PopUps.editMotivation($scope, function(newMotivation){
            if (newMotivation != null) {
                var motivation = {
                    "motivation": newMotivation
                }
                StudentInfo.updateMotivation("studentID", self.doel._id, motivation, function (response) {                    
                    self.getDoel();
                }, function (error) {
                    console.log(error);
                });
            }
        });
    };

    self.toStap = function (stapID) {
        AllData.toPage("Stap", "#/doelen/" + doelID + "/" + stapID);
    };
};

zwengelControllers.controller('AllController', ['$ionicPlatform', '$window', '$route', 'AllData', controllers.AllController]);
zwengelControllers.controller('LoginController', ['$ionicScrollDelegate', '$rootScope', '$ionicPopup', 'Authentication', 'AllData', controllers.LoginController]);
zwengelControllers.controller('DoelenController', ['$ionicScrollDelegate', 'AllData', 'StudentInfo', controllers.DoelenController]);
zwengelControllers.controller('ProfielController', ['$ionicScrollDelegate', '$ionicPopup', 'AllData', 'Authentication', 'StudentInfo', controllers.ProfielController]);
zwengelControllers.controller('DoelController', ['$ionicScrollDelegate', '$routeParams', '$scope', '$ionicPopup', 'AllData', 'StudentInfo', 'PopUps', controllers.DoelController]);
