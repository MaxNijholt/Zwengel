(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function($window, $ionicPlatform, AllData) {
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
},{}],2:[function(require,module,exports){
require('angular-route/angular-route');

var app = angular.module('zwengelApp', ['ngRoute', 'ionic']);

app.factory('AllData', [require('./app.service.js')]);
app.service('DoelenService', ['$http', require('./doelen/doelen.service.js')]);
app.service('BeloningenService', ['$http', require('./beloningen/beloningen.service.js')]);

app.controller('AllController', ['$window', '$ionicPlatform', 'AllData', require('./app.controller.js')]);
app.controller('DoelenController', ['$ionicScrollDelegate', 'AllData', 'DoelenService', require('./doelen/doelen.controller.js')]);
app.controller('DoelController', ['$ionicScrollDelegate', '$routeParams', 'AllData', 'DoelenService', require('./doelen/doel.controller.js')]);
app.controller('StapController', ['$ionicScrollDelegate', '$routeParams', 'AllData', 'DoelenService', require('./doelen/stap.controller.js')]);
app.controller('BeloningenController', ['$ionicScrollDelegate', 'BeloningenService', require('./beloningen/beloningen.controller.js')]);
app.controller('ProfielController', ['$ionicScrollDelegate', 'AllData', require('./profiel/profiel.controller.js')]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/doelen', {
        	templateUrl: 'views/doelen.html',
        	controller: 'DoelenController as denc'
        }).
        when('/doelen/:doelID', {
        	templateUrl: 'views/doel.html',
        	controller: 'DoelController as dc'
        }).
        when('/doelen/:doelID/:stapID', {
        	templateUrl: 'views/stap.html',
        	controller: 'StapController as sc'
        }).
        when('/beloningen', {
        	templateUrl: 'views/beloningen.html',
        	controller: 'BeloningenController as benc'
        }).
        when('/profiel', {
        	templateUrl: 'views/profiel.html',
        	controller: 'ProfielController as pc'
        }).
        otherwise({
        	redirectTo: '/doelen'
        });
    }
]);
},{"./app.controller.js":1,"./app.service.js":3,"./beloningen/beloningen.controller.js":4,"./beloningen/beloningen.service.js":5,"./doelen/doel.controller.js":6,"./doelen/doelen.controller.js":7,"./doelen/doelen.service.js":8,"./doelen/stap.controller.js":9,"./profiel/profiel.controller.js":10,"angular-route/angular-route":11}],3:[function(require,module,exports){
module.exports = function(){
    var self = this;
    
    self.to = function(title, url) {
        self.page.title = title;
        self.page.url = url;
        window.location.replace(url);
    }
    
    self.pushHistory = function(){
        var object = {
            title: self.page.title,
            url: self.page.url
        };
        
        self.history.push(object);
    };
    
    self.page = {
        title: "Doelen",
        url: "#/doelen"
    };
    
    self.pref = {
        doelscreen: "list",
        textIcons: "half"
    };
    
    self.history = [];
    
    self.toPage = function(title, url){
        self.pushHistory();
        self.to(title, url);
    };
    
    self.toBack = function(phoneBack){
        if(self.history.length > 0){
            var historyItem = self.history.pop();
            self.to(historyItem.title, historyItem.url, historyItem.doel, historyItem.step);
        }else{
            if(phoneBack){
                var confirm = window.confirm("Afsluiten");
                if (confirm == true) {
                    // navigator.app.exitApp(); //phoneghap error met plugin
                }
            }            
        }
    };
    
    return {
        page: self.page,
        pref: self.pref,
        history: self.history,
        toPage: self.toPage,
        toBack: self.toBack
    }
};
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
module.exports = function($http) {
	var self = this;
    var dataCaller = {};
    
    dataCaller.getBeloningen = function(studentID, onSucces){
        var testResult = [{ 
            "title": "10 min. spelletje spelen in de les",
            "price": 5,
            "behaald": true
        },{ 
            "title": "15 min. spelletje spelen in de les",
            "price": 7,
            "behaald": false
        },{ 
            "title": "Thema Ridder",
            "price": 25,
            "behaald": false
        },{ 
            "title": "Thema Koning",
            "price": 25,
            "behaald": true
        },{ 
            "title": "Als eerste naar huis",
            "price": 10,
            "behaald": false
        }
        ];
        
        onSucces(testResult);
    };
    
    self.getBeloningen = function(studentID, onSucces){
        dataCaller.getBeloningen(studentID, onSucces);
    };

	return {
        getBeloningen: self.getBeloningen
	};
};
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
module.exports = function($http) {
	var self = this;
    var dataCaller = {};
    
    dataCaller.testResult = [
        {
            "id": "t1",
            "title": "Overtuigen",
            "description": "De student kan met een medestudent in discussie gaan en de ander van eigen mening overtuigen.",
            "icon": "ion-chatbubbles",
            "done": "doing",
            "motivation": null,
            "startDate": "02-02-2016",
            "endDate": "04-08-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "Vragen stellen",
                    "description": "De student vraagt een medestudent om zijn mening.",
                    "done": "good",
                    "endDate": "02-02-2016"
                },
                {
                    "id": "st2",
                    "title": "Complimenten voor 5 weken",
                    "description": "De student heeft 5 weken lang elke week een compliment aan een medestudent gegeven.",
                    "done": "good",
                    "endDate": "12-03-2015"
                },
                {
                    "id": "st3",
                    "title": "12 complimenten in 4 weken",
                    "description": "De leerling heeft 4 weken lang elke week 3 complimenten gegeven aan medestudenten.",
                    "done": "doing",
                    "endDate": "29-05-2015"
                },
                {
                    "id": "st4",
                    "title": "21 complimenten in 3 weken",
                    "description": "3 weken lang heeft de student elke dag een compliment gegeven aan een medestudent.",
                    "done": "doing",
                    "endDate": "14-07-2015"
                }
            ]
        },
        {
            "id": "t2",
            "title": "De rekentafels kennen",
            "description": "De student kent de tafels van 1 tot en met 10 uit zijn hoofd.",
            "icon": "ion-calculator",
            "done": "doing",
            "motivation": null,
            "startDate": "01-01-2016",
            "endDate": "04-05-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "Tafels 1, 2 en 3",
                    "description": "De leerling moet de tafel van 1, 2 en 3 uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "21-02-2016"
                },
                {
                    "id": "st2",
                    "title": "Tafels 4 en 5",
                    "description": "De leerling moet de tafels van 1 tot en met 5 uit zijn hoofd kennen.",
                    "done": "bad",
                    "endDate": "02-03-2016"
                },
                {
                    "id": "st3",
                    "title": "Tafels 6 en 7",
                    "description": "De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
                    "done": "doing",
                    "endDate": "29-03-2016"
                },
                {
                    "id": "st4",
                    "title": "Tafels 8 en 9",
                    "description": "Tafels 8 en 9 zijn erg moeilijk en moeten ook geleerd worden. De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
                    "done": "doing",
                    "endDate": "21-04-2016"
                },
                {
                    "id": "st5",
                    "title": "Tafel van 10",
                    "description": "10 is vrij makkelijk. Deze moet ook geleerd worden.",
                    "done": "doing",
                    "endDate": "04-05-2016"
                }
            ]
        },
        {
            "id": "t3",
            "title": "Het Wilhelmus kennen",
            "description": "De student kent het Wilhelmus uit zijn hoofd.",
            "icon": "ion-volume-high",
            "done": "doing",
            "motivation": null,
            "startDate": "01-02-2016",
            "endDate": "01-04-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "Eerste couplet",
                    "description": "De leerling kent het eerste couplet uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "15-02-2016"
                },
                {
                    "id": "st2",
                    "title": "Eerste refrein",
                    "description": "De leerling kent het eerste refrein uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "01-03-2016"
                },
                {
                    "id": "st3",
                    "title": "Tweede couplet",
                    "description": "De leerling kent het tweede couplet uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "11-03-2016"
                },
                {
                    "id": "st4",
                    "title": "Tweede refrein",
                    "description": "De leerling kent het tweede refrein uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "22-03-2016"
                },
                {
                    "id": "st5",
                    "title": "Derde couplet",
                    "description": "De leerling kent het derde couplet uit zijn hoofd kennen.",
                    "done": "doing",
                    "endDate": "01-04-2016"
                }
            ]
        },
        {
            "id": "t4",
            "title": "Minder praten tijdens de les",
            "description": "De student kan zich langere tijd stil houden in de les. Hierbij is het doel om 15 minuten lang niks te zeggen",
            "icon": "ion-volume-low",
            "done": "good",
            "motivation": 4,
            "startDate": "29-01-2016",
            "endDate": "05-03-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "4x2 min",
                    "description": "4 keer 2 min in de les niks zeggen",
                    "done": "good",
                    "endDate": "10-02-2016"
                },
                {
                    "id": "st2",
                    "title": "4x3 min",
                    "description": "4 keer 3 min in de les niks zeggen.",
                    "done": "good",
                    "endDate": "12-02-2016"
                },
                {
                    "id": "st3",
                    "title": "2x5 min",
                    "description": "2 keer moet in de les 5 minuten lang niks gezegd worden.",
                    "done": "good",
                    "endDate": "17-02-2016"
                },
                {
                    "id": "st4",
                    "title": "2x7 min",
                    "description": "De student moet in de les 7 minuten lang niks zeggen. Dit moet tijdens een les 2 keer gedaan worden.",
                    "done": "good",
                    "endDate": "25-02-2016"
                },
                {
                    "id": "st5",
                    "title": "1x10 min",
                    "description": "1 keer stil zijn 10 minuten lang.",
                    "done": "good",
                    "endDate": "29-02-2016"
                },
                {
                    "id": "st6",
                    "title": "1x15 min",
                    "description": "De student moet een kwartier lang stil zijn tijdens de les.",
                    "done": "good",
                    "endDate": "05-03-2016"
                }
            ]
        },
        {
            "id": "t5",
            "title": "Planning nakomen",
            "description": "De student kan de planning nakomen die hem aan het begin van de maand gegeven is, nakomen.",
            "icon": "ion-calendar",
            "done": "bad",
            "motivation": 1,
            "startDate": "01-07-2015",
            "endDate": "31-01-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "4 van de 10 taken",
                    "description": "Aan het eind van de maand moeten 4 van de 10 taken af zijn.",
                    "done": "good",
                    "endDate": "31-07-2015"
                },
                {
                    "id": "st2",
                    "title": "5 van de 10 taken",
                    "description": "De helft van de taken moet aan het eind van de maand af zijn.",
                    "done": "bad",
                    "endDate": "31-08-2015"
                },
                {
                    "id": "st3",
                    "title": "6 van de 10 taken",
                    "description": "6 taken moeten aan het eind van de maand af zijn.",
                    "done": "bad",
                    "endDate": "31-09-2015"
                },
                {
                    "id": "st4",
                    "title": "7 van de 10 taken",
                    "description": "De student moet 7 taken van de 10 af hebben aan het einde van de maand.",
                    "done": "bad",
                    "endDate": "31-10-2015"
                },
                {
                    "id": "st5",
                    "title": "8 van de 10 taken",
                    "description": "Aan het einde van de maand moeten 8 taken af zijn.",
                    "done": "bad",
                    "endDate": "31-11-2015"
                },
                {
                    "id": "st6",
                    "title": "9 van de 10 taken",
                    "description": "9 van de 10 taken moeten zijn afgerond aan het einde van de maand.",
                    "done": "bad",
                    "endDate": "31-12-2015"
                },
                {
                    "id": "st7",
                    "title": "10 van de 10 taken",
                    "description": "De student moet zijn planning volledig hebben nagekomen.",
                    "done": "bad",
                    "endDate": "31-01-2016"
                }
            ]
        },
        {
            "id": "t6",
            "title": "Complimenten geven",
            "description": "De student moet dagelijks een compliment geven aan een medeleerling",
            "icon": "ion-android-contacts",
            "done": "good",
            "motivation": 5,
            "startDate": "19-11-2014",
            "endDate": "10-05-2015",
            "steps": [
                {
                    "id": "st1",
                    "title": "Eerste compliment",
                    "description": "De leerling heeft een medestudent een compliment gegeven.",
                    "done": "good",
                    "endDate": "31-12-2014"
                },
                {
                    "id": "st2",
                    "title": "Complimenten voor 5 weken",
                    "description": "De student heeft 5 weken lang elke week een compliment aan een medestudent gegeven.",
                    "done": "good",
                    "endDate": "12-03-2015"
                },
                {
                    "id": "st3",
                    "title": "12 complimenten in 4 weken",
                    "description": "De leerling heeft 4 weken lang elke week 3 complimenten gegeven aan medestudenten.",
                    "done": "good",
                    "endDate": "29-05-2015"
                },
                {
                    "id": "st4",
                    "title": "21 complimenten in 3 weken",
                    "description": "3 weken lang heeft de student elke dag een compliment gegeven aan een medestudent.",
                    "done": "good",
                    "endDate": "14-07-2015"
                }
            ]
        }
    ];

    dataCaller.getDoelen = function(studentID, onSucces){    
        onSucces(dataCaller.testResult);
    };

    dataCaller.getDoel = function(studentID, doelID, onSucces){
        var doel = null;
        
        dataCaller.testResult.forEach(function(object){
            if(object.id === doelID){
                doel = object;
            }
        });
        
        onSucces(doel);
    };
    
    dataCaller.getStap = function(studentID, doelID, stapID, onSucces){
        var stap = null;
        
        dataCaller.testResult.forEach(function(object){
            if(object.id === doelID){
                object.steps.forEach(function(object2){
                if(object2.id === stapID){
                    stap = object2;
                }
                });
            }
        });
        
        onSucces(stap);
    };
    
    self.getDoelen = function(studentID, onSucces){
        dataCaller.getDoelen(studentID, onSucces);
    };
    
    self.getDoel = function(studentID, doelID, onSucces){
        dataCaller.getDoel(studentID, doelID, onSucces);
    };
    
    self.getStap = function(studentID, doelID, stapID, onSucces){
        dataCaller.getStap(studentID, doelID, stapID, onSucces);
    };

	return {
        getDoelen: self.getDoelen,
        getDoel: self.getDoel,
        getStap: self.getStap
	};
};
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
module.exports = function($ionicScrollDelegate, AllData) {
    var self = this;
    
    $ionicScrollDelegate.scrollTop();
    
    self.doelscreen = AllData.pref.doelscreen;
    self.textIcons = AllData.pref.textIcons;
    self.thema = "default";
};
},{}],11:[function(require,module,exports){
/**
 * @license AngularJS v1.5.5
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider),
    $routeMinErr = angular.$$minErr('ngRoute');

/**
 * @ngdoc provider
 * @name $routeProvider
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider() {
  function inherit(parent, extra) {
    return angular.extend(Object.create(parent), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
   *      If present, the controller will be published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired.
   *      For easier access to the resolved dependencies from the template, the `resolve` map will
   *      be available on the scope of the route, under `$resolve` (by default) or a custom name
   *      specified by the `resolveAs` property (see below). This can be particularly useful, when
   *      working with {@link angular.Module#component components} as route templates.<br />
   *      <div class="alert alert-warning">
   *        **Note:** If your scope already contains a property with this name, it will be hidden
   *        or overwritten. Make sure, you specify an appropriate name for this property, that
   *        does not collide with other properties on the scope.
   *      </div>
   *      The map object is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `resolveAs` - `{string=}` - The name under which the `resolve` map will be available on
   *      the scope of the route. If omitted, defaults to `$resolve`.
   *
   *    - `redirectTo` – `{(string|function())=}` – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - `{boolean=}` - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - `{boolean=}` - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    //copy original route object to preserve params inherited from proto chain
    var routeCopy = angular.copy(route);
    if (angular.isUndefined(routeCopy.reloadOnSearch)) {
      routeCopy.reloadOnSearch = true;
    }
    if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
      routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
    }
    routes[path] = angular.extend(
      routeCopy,
      path && pathRegExp(path, routeCopy)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length - 1] == '/')
            ? path.substr(0, path.length - 1)
            : path + '/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, routeCopy)
      );
    }

    return this;
  };

  /**
   * @ngdoc property
   * @name $routeProvider#caseInsensitiveMatch
   * @description
   *
   * A boolean property indicating if routes defined
   * using this provider should be matched using a case insensitive
   * algorithm. Defaults to `false`.
   */
  this.caseInsensitiveMatch = false;

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g, function(_, slash, key, option) {
        var optional = (option === '?' || option === '*?') ? '?' : null;
        var star = (option === '*' || option === '*?') ? '*' : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object|string} params Mapping information to be assigned to `$route.current`.
   * If called with a string, the value maps to `redirectTo`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    if (typeof params === 'string') {
      params = {redirectTo: params};
    }
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$templateRequest',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as defined in the route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     *     The `locals` will be assigned to the route scope's `$resolve` property. You can override
     *     the property name, using `resolveAs` in the route definition. See
     *     {@link ngRoute.$routeProvider $routeProvider} for more info.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * The route change (and the `$location` change that triggered it) can be prevented
     * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
     * for more details about event object.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route change has happened successfully.
     * The `resolve` dependencies are now available in the `current.locals` property.
     *
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current/previous route information.
     */

    var forceReload = false,
        preparedRoute,
        preparedRouteIsUpdateOnly,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope and reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;

            var fakeLocationEvent = {
              defaultPrevented: false,
              preventDefault: function fakePreventDefault() {
                this.defaultPrevented = true;
                forceReload = false;
              }
            };

            $rootScope.$evalAsync(function() {
              prepareRoute(fakeLocationEvent);
              if (!fakeLocationEvent.defaultPrevented) commitRoute();
            });
          },

          /**
           * @ngdoc method
           * @name $route#updateParams
           *
           * @description
           * Causes `$route` service to update the current URL, replacing
           * current route parameters with those specified in `newParams`.
           * Provided property names that match the route's path segment
           * definitions will be interpolated into the location's path, while
           * remaining properties will be treated as query params.
           *
           * @param {!Object<string, string>} newParams mapping of URL parameter names to values
           */
          updateParams: function(newParams) {
            if (this.current && this.current.$$route) {
              newParams = angular.extend({}, this.current.params, newParams);
              $location.path(interpolate(this.current.$$route.originalPath, newParams));
              // interpolate modifies newParams, only query params are left
              $location.search(newParams);
            } else {
              throw $routeMinErr('norout', 'Tried updating route when with no current route');
            }
          }
        };

    $rootScope.$on('$locationChangeStart', prepareRoute);
    $rootScope.$on('$locationChangeSuccess', commitRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function prepareRoute($locationEvent) {
      var lastRoute = $route.current;

      preparedRoute = parseRoute();
      preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
          && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
          && !preparedRoute.reloadOnSearch && !forceReload;

      if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
          if ($locationEvent) {
            $locationEvent.preventDefault();
          }
        }
      }
    }

    function commitRoute() {
      var lastRoute = $route.current;
      var nextRoute = preparedRoute;

      if (preparedRouteIsUpdateOnly) {
        lastRoute.params = nextRoute.params;
        angular.copy(lastRoute.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', lastRoute);
      } else if (nextRoute || lastRoute) {
        forceReload = false;
        $route.current = nextRoute;
        if (nextRoute) {
          if (nextRoute.redirectTo) {
            if (angular.isString(nextRoute.redirectTo)) {
              $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
                       .replace();
            } else {
              $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(nextRoute).
          then(function() {
            if (nextRoute) {
              var locals = angular.extend({}, nextRoute.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value, null, null, key);
              });

              if (angular.isDefined(template = nextRoute.template)) {
                if (angular.isFunction(template)) {
                  template = template(nextRoute.params);
                }
              } else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(nextRoute.params);
                }
                if (angular.isDefined(templateUrl)) {
                  nextRoute.loadedTemplateUrl = $sce.valueOf(templateUrl);
                  template = $templateRequest(templateUrl);
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          then(function(locals) {
            // after route change
            if (nextRoute == $route.current) {
              if (nextRoute) {
                nextRoute.locals = locals;
                angular.copy(nextRoute.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
            }
          }, function(error) {
            if (nextRoute == $route.current) {
              $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
            }
          });
      }
    }


    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string || '').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM |
 * | {@link ng.$animate#leave leave}  | when the old element is removed from to the DOM  |
 *
 * The enter and leave animation occur concurrently.
 *
 * @knownIssue If `ngView` is contained in an asynchronously loaded template (e.g. in another
 *             directive's templateUrl or in a template loaded using `ngInclude`), then you need to
 *             make sure that `$route` is instantiated in time to capture the initial
 *             `$locationChangeStart` event and load the appropriate view. One way to achieve this
 *             is to have it as a dependency in a `.run` block:
 *             `myModule.run(['$route', function() {}]);`
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function($routeParams) {
            this.name = "BookCtrl";
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
            this.name = "ChapterCtrl";
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory($route, $anchorScroll, $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousLeaveAnimation,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.then(function() {
              previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }
      scope[current.resolveAs || '$resolve'] = locals;

      link(scope);
    }
  };
}


})(window, window.angular);

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmNvbnRyb2xsZXIuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2FwcC5zZXJ2aWNlLmpzIiwiYXBwL2pzL2JlbG9uaW5nZW4vYmVsb25pbmdlbi5jb250cm9sbGVyLmpzIiwiYXBwL2pzL2JlbG9uaW5nZW4vYmVsb25pbmdlbi5zZXJ2aWNlLmpzIiwiYXBwL2pzL2RvZWxlbi9kb2VsLmNvbnRyb2xsZXIuanMiLCJhcHAvanMvZG9lbGVuL2RvZWxlbi5jb250cm9sbGVyLmpzIiwiYXBwL2pzL2RvZWxlbi9kb2VsZW4uc2VydmljZS5qcyIsImFwcC9qcy9kb2VsZW4vc3RhcC5jb250cm9sbGVyLmpzIiwiYXBwL2pzL3Byb2ZpZWwvcHJvZmllbC5jb250cm9sbGVyLmpzIiwibm9kZV9tb2R1bGVzL2FuZ3VsYXItcm91dGUvYW5ndWxhci1yb3V0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHdpbmRvdywgJGlvbmljUGxhdGZvcm0sIEFsbERhdGEpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgc2VsZi5wYWdlID0gQWxsRGF0YS5wYWdlO1xyXG4gICAgXHJcbiAgICBzZWxmLm5hdkRvZWxlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgQWxsRGF0YS50b1BhZ2UoXCJEb2VsZW5cIiwgXCIjL2RvZWxlblwiKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNlbGYubmF2QmVsb25pbmdlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgQWxsRGF0YS50b1BhZ2UoXCJCZWxvbmluZ2VuXCIsIFwiIy9iZWxvbmluZ2VuXCIpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2VsZi5uYXZQcm9maWVsID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBBbGxEYXRhLnRvUGFnZShcIlByb2ZpZWxcIiwgXCIjL3Byb2ZpZWxcIik7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBzZWxmLmJhY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0QWxsRGF0YS50b0JhY2soKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgICRpb25pY1BsYXRmb3JtLnJlZ2lzdGVyQmFja0J1dHRvbkFjdGlvbihmdW5jdGlvbiAoKSB7XHJcblx0XHRBbGxEYXRhLnRvQmFjayh0cnVlKTtcclxuXHR9LCAxMDApO1xyXG59OyIsInJlcXVpcmUoJ2FuZ3VsYXItcm91dGUvYW5ndWxhci1yb3V0ZScpO1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCd6d2VuZ2VsQXBwJywgWyduZ1JvdXRlJywgJ2lvbmljJ10pO1xyXG5cclxuYXBwLmZhY3RvcnkoJ0FsbERhdGEnLCBbcmVxdWlyZSgnLi9hcHAuc2VydmljZS5qcycpXSk7XHJcbmFwcC5zZXJ2aWNlKCdEb2VsZW5TZXJ2aWNlJywgWyckaHR0cCcsIHJlcXVpcmUoJy4vZG9lbGVuL2RvZWxlbi5zZXJ2aWNlLmpzJyldKTtcclxuYXBwLnNlcnZpY2UoJ0JlbG9uaW5nZW5TZXJ2aWNlJywgWyckaHR0cCcsIHJlcXVpcmUoJy4vYmVsb25pbmdlbi9iZWxvbmluZ2VuLnNlcnZpY2UuanMnKV0pO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ0FsbENvbnRyb2xsZXInLCBbJyR3aW5kb3cnLCAnJGlvbmljUGxhdGZvcm0nLCAnQWxsRGF0YScsIHJlcXVpcmUoJy4vYXBwLmNvbnRyb2xsZXIuanMnKV0pO1xyXG5hcHAuY29udHJvbGxlcignRG9lbGVuQ29udHJvbGxlcicsIFsnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLCAnQWxsRGF0YScsICdEb2VsZW5TZXJ2aWNlJywgcmVxdWlyZSgnLi9kb2VsZW4vZG9lbGVuLmNvbnRyb2xsZXIuanMnKV0pO1xyXG5hcHAuY29udHJvbGxlcignRG9lbENvbnRyb2xsZXInLCBbJyRpb25pY1Njcm9sbERlbGVnYXRlJywgJyRyb3V0ZVBhcmFtcycsICdBbGxEYXRhJywgJ0RvZWxlblNlcnZpY2UnLCByZXF1aXJlKCcuL2RvZWxlbi9kb2VsLmNvbnRyb2xsZXIuanMnKV0pO1xyXG5hcHAuY29udHJvbGxlcignU3RhcENvbnRyb2xsZXInLCBbJyRpb25pY1Njcm9sbERlbGVnYXRlJywgJyRyb3V0ZVBhcmFtcycsICdBbGxEYXRhJywgJ0RvZWxlblNlcnZpY2UnLCByZXF1aXJlKCcuL2RvZWxlbi9zdGFwLmNvbnRyb2xsZXIuanMnKV0pO1xyXG5hcHAuY29udHJvbGxlcignQmVsb25pbmdlbkNvbnRyb2xsZXInLCBbJyRpb25pY1Njcm9sbERlbGVnYXRlJywgJ0JlbG9uaW5nZW5TZXJ2aWNlJywgcmVxdWlyZSgnLi9iZWxvbmluZ2VuL2JlbG9uaW5nZW4uY29udHJvbGxlci5qcycpXSk7XHJcbmFwcC5jb250cm9sbGVyKCdQcm9maWVsQ29udHJvbGxlcicsIFsnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLCAnQWxsRGF0YScsIHJlcXVpcmUoJy4vcHJvZmllbC9wcm9maWVsLmNvbnRyb2xsZXIuanMnKV0pO1xyXG5cclxuYXBwLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJyxcclxuICAgIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXIuXHJcbiAgICAgICAgd2hlbignL2RvZWxlbicsIHtcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAndmlld3MvZG9lbGVuLmh0bWwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlcjogJ0RvZWxlbkNvbnRyb2xsZXIgYXMgZGVuYydcclxuICAgICAgICB9KS5cclxuICAgICAgICB3aGVuKCcvZG9lbGVuLzpkb2VsSUQnLCB7XHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RvZWwuaHRtbCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyOiAnRG9lbENvbnRyb2xsZXIgYXMgZGMnXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgd2hlbignL2RvZWxlbi86ZG9lbElELzpzdGFwSUQnLCB7XHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3N0YXAuaHRtbCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyOiAnU3RhcENvbnRyb2xsZXIgYXMgc2MnXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgd2hlbignL2JlbG9uaW5nZW4nLCB7XHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2JlbG9uaW5nZW4uaHRtbCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyOiAnQmVsb25pbmdlbkNvbnRyb2xsZXIgYXMgYmVuYydcclxuICAgICAgICB9KS5cclxuICAgICAgICB3aGVuKCcvcHJvZmllbCcsIHtcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAndmlld3MvcHJvZmllbC5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdQcm9maWVsQ29udHJvbGxlciBhcyBwYydcclxuICAgICAgICB9KS5cclxuICAgICAgICBvdGhlcndpc2Uoe1xyXG4gICAgICAgIFx0cmVkaXJlY3RUbzogJy9kb2VsZW4nXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbl0pOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgc2VsZi50byA9IGZ1bmN0aW9uKHRpdGxlLCB1cmwpIHtcclxuICAgICAgICBzZWxmLnBhZ2UudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICBzZWxmLnBhZ2UudXJsID0gdXJsO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHVybCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNlbGYucHVzaEhpc3RvcnkgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBzZWxmLnBhZ2UudGl0bGUsXHJcbiAgICAgICAgICAgIHVybDogc2VsZi5wYWdlLnVybFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2VsZi5oaXN0b3J5LnB1c2gob2JqZWN0KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNlbGYucGFnZSA9IHtcclxuICAgICAgICB0aXRsZTogXCJEb2VsZW5cIixcclxuICAgICAgICB1cmw6IFwiIy9kb2VsZW5cIlxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2VsZi5wcmVmID0ge1xyXG4gICAgICAgIGRvZWxzY3JlZW46IFwibGlzdFwiLFxyXG4gICAgICAgIHRleHRJY29uczogXCJoYWxmXCJcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNlbGYuaGlzdG9yeSA9IFtdO1xyXG4gICAgXHJcbiAgICBzZWxmLnRvUGFnZSA9IGZ1bmN0aW9uKHRpdGxlLCB1cmwpe1xyXG4gICAgICAgIHNlbGYucHVzaEhpc3RvcnkoKTtcclxuICAgICAgICBzZWxmLnRvKHRpdGxlLCB1cmwpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2VsZi50b0JhY2sgPSBmdW5jdGlvbihwaG9uZUJhY2spe1xyXG4gICAgICAgIGlmKHNlbGYuaGlzdG9yeS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdmFyIGhpc3RvcnlJdGVtID0gc2VsZi5oaXN0b3J5LnBvcCgpO1xyXG4gICAgICAgICAgICBzZWxmLnRvKGhpc3RvcnlJdGVtLnRpdGxlLCBoaXN0b3J5SXRlbS51cmwsIGhpc3RvcnlJdGVtLmRvZWwsIGhpc3RvcnlJdGVtLnN0ZXApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBpZihwaG9uZUJhY2spe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSB3aW5kb3cuY29uZmlybShcIkFmc2x1aXRlblwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChjb25maXJtID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBuYXZpZ2F0b3IuYXBwLmV4aXRBcHAoKTsgLy9waG9uZWdoYXAgZXJyb3IgbWV0IHBsdWdpblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwYWdlOiBzZWxmLnBhZ2UsXHJcbiAgICAgICAgcHJlZjogc2VsZi5wcmVmLFxyXG4gICAgICAgIGhpc3Rvcnk6IHNlbGYuaGlzdG9yeSxcclxuICAgICAgICB0b1BhZ2U6IHNlbGYudG9QYWdlLFxyXG4gICAgICAgIHRvQmFjazogc2VsZi50b0JhY2tcclxuICAgIH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpb25pY1Njcm9sbERlbGVnYXRlLCBCZWxvbmluZ2VuU2VydmljZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgXHJcbiAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcclxuICAgIFxyXG4gICAgc2VsZi5oaWRlRmlsdGVyID0gXCJuZy1oaWRlXCI7XHJcblx0c2VsZi5maWx0ZXJJY29uID0gXCJpb24tY2hldnJvbi1kb3duXCI7XHJcbiAgICBcclxuICAgIEJlbG9uaW5nZW5TZXJ2aWNlLmdldEJlbG9uaW5nZW4oXCJ0ZXN0XCIgLCBmdW5jdGlvbihyZXN1bHRzKXtcclxuICAgICAgICBzZWxmLnJld2FyZHMgPSByZXN1bHRzO1xyXG4gICAgfSk7XHJcbiAgICBcdFxyXG4gICAgc2VsZi5idXlSZXdhcmQgPSBmdW5jdGlvbihyZXdhcmQpe1xyXG4gICAgICAgIHZhciBjb25maXJtID0gd2luZG93LmNvbmZpcm0oXCJLb29wIGJlbG9uaW5nOiBcIiArIHJld2FyZC50aXRsZSk7XHJcbiAgICAgICAgaWYgKGNvbmZpcm0gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBhbGVydChcIkdla29jaHRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgICAgICBcclxuXHRzZWxmLnRvZ2dsZUhpZGVGaWx0ZXIgPSBmdW5jdGlvbihib29sKXtcclxuXHRcdGlmKHNlbGYuaGlkZUZpbHRlciA9PT0gXCJuZy1oaWRlXCIgJiYgIWJvb2wpe1xyXG5cdFx0XHRzZWxmLmhpZGVGaWx0ZXIgPSBcIm5nLXNob3dcIjtcclxuXHRcdFx0c2VsZi5maWx0ZXJJY29uID0gXCJpb24tY2hldnJvbi11cFwiO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHNlbGYuaGlkZUZpbHRlciA9IFwibmctaGlkZVwiO1xyXG5cdFx0XHRzZWxmLmZpbHRlckljb24gPSBcImlvbi1jaGV2cm9uLWRvd25cIjtcclxuXHRcdH1cclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGh0dHApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgZGF0YUNhbGxlciA9IHt9O1xyXG4gICAgXHJcbiAgICBkYXRhQ2FsbGVyLmdldEJlbG9uaW5nZW4gPSBmdW5jdGlvbihzdHVkZW50SUQsIG9uU3VjY2VzKXtcclxuICAgICAgICB2YXIgdGVzdFJlc3VsdCA9IFt7IFxyXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiMTAgbWluLiBzcGVsbGV0amUgc3BlbGVuIGluIGRlIGxlc1wiLFxyXG4gICAgICAgICAgICBcInByaWNlXCI6IDUsXHJcbiAgICAgICAgICAgIFwiYmVoYWFsZFwiOiB0cnVlXHJcbiAgICAgICAgfSx7IFxyXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiMTUgbWluLiBzcGVsbGV0amUgc3BlbGVuIGluIGRlIGxlc1wiLFxyXG4gICAgICAgICAgICBcInByaWNlXCI6IDcsXHJcbiAgICAgICAgICAgIFwiYmVoYWFsZFwiOiBmYWxzZVxyXG4gICAgICAgIH0seyBcclxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRoZW1hIFJpZGRlclwiLFxyXG4gICAgICAgICAgICBcInByaWNlXCI6IDI1LFxyXG4gICAgICAgICAgICBcImJlaGFhbGRcIjogZmFsc2VcclxuICAgICAgICB9LHsgXHJcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGVtYSBLb25pbmdcIixcclxuICAgICAgICAgICAgXCJwcmljZVwiOiAyNSxcclxuICAgICAgICAgICAgXCJiZWhhYWxkXCI6IHRydWVcclxuICAgICAgICB9LHsgXHJcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJBbHMgZWVyc3RlIG5hYXIgaHVpc1wiLFxyXG4gICAgICAgICAgICBcInByaWNlXCI6IDEwLFxyXG4gICAgICAgICAgICBcImJlaGFhbGRcIjogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuICAgICAgICBcclxuICAgICAgICBvblN1Y2Nlcyh0ZXN0UmVzdWx0KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNlbGYuZ2V0QmVsb25pbmdlbiA9IGZ1bmN0aW9uKHN0dWRlbnRJRCwgb25TdWNjZXMpe1xyXG4gICAgICAgIGRhdGFDYWxsZXIuZ2V0QmVsb25pbmdlbihzdHVkZW50SUQsIG9uU3VjY2VzKTtcclxuICAgIH07XHJcblxyXG5cdHJldHVybiB7XHJcbiAgICAgICAgZ2V0QmVsb25pbmdlbjogc2VsZi5nZXRCZWxvbmluZ2VuXHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpb25pY1Njcm9sbERlbGVnYXRlLCAkcm91dGVQYXJhbXMsIEFsbERhdGEsIERvZWxlblNlcnZpY2UpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XHJcbiAgICB2YXIgZG9lbElEO1xyXG4gICAgXHJcbiAgICBEb2VsZW5TZXJ2aWNlLmdldERvZWwoXCJ0ZXN0XCIsICRyb3V0ZVBhcmFtcy5kb2VsSUQsIGZ1bmN0aW9uKHJlc3VsdHMpe1xyXG4gICAgICAgIHJlc3VsdHMuc3RlcHMuZm9yRWFjaChmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICAgICAgICBzd2l0Y2gob2JqZWN0LmRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJnb29kXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRvbmVDb2xvciA9IFwiYmFsYW5jZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJiYWRcIjpcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3QuZG9uZUNvbG9yID0gXCJhc3NlcnRpdmVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRvbmVDb2xvciA9IFwicG9zaXRpdmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlbGYuZG9lbCA9IHJlc3VsdHM7XHJcbiAgICAgICAgZG9lbElEID0gcmVzdWx0cy5pZDtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBzZWxmLnRvU3RhcCA9IGZ1bmN0aW9uKHN0YXBJRCl7XHJcbiAgICAgICAgQWxsRGF0YS50b1BhZ2UoXCJTdGFwXCIsIFwiIy9kb2VsZW4vXCIgKyBkb2VsSUQgKyBcIi9cIiArIHN0YXBJRCk7XHJcbiAgICB9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGlvbmljU2Nyb2xsRGVsZWdhdGUsIEFsbERhdGEsIERvZWxlblNlcnZpY2UpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XHJcbiAgICBcclxuICAgIERvZWxlblNlcnZpY2UuZ2V0RG9lbGVuKFwidGVzdFwiLCBmdW5jdGlvbihyZXN1bHRzKXtcclxuICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgc3dpdGNoKG9iamVjdC5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZ29vZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5kb25lQ29sb3IgPSBcImJhbGFuY2VkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYmFkXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRvbmVDb2xvciA9IFwiYXNzZXJ0aXZlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5kb25lQ29sb3IgPSBcInBvc2l0aXZlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxmLnRhcmdldHMgPSByZXN1bHRzO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIHNlbGYudG9Eb2VsID0gZnVuY3Rpb24oZG9lbElEKXtcclxuICAgICAgICBBbGxEYXRhLnRvUGFnZShcIkRvZWxcIiwgXCIjL2RvZWxlbi9cIiArIGRvZWxJRCk7XHJcbiAgICB9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGh0dHApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgZGF0YUNhbGxlciA9IHt9O1xyXG4gICAgXHJcbiAgICBkYXRhQ2FsbGVyLnRlc3RSZXN1bHQgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcImlkXCI6IFwidDFcIixcclxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIk92ZXJ0dWlnZW5cIixcclxuICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQga2FuIG1ldCBlZW4gbWVkZXN0dWRlbnQgaW4gZGlzY3Vzc2llIGdhYW4gZW4gZGUgYW5kZXIgdmFuIGVpZ2VuIG1lbmluZyBvdmVydHVpZ2VuLlwiLFxyXG4gICAgICAgICAgICBcImljb25cIjogXCJpb24tY2hhdGJ1YmJsZXNcIixcclxuICAgICAgICAgICAgXCJkb25lXCI6IFwiZG9pbmdcIixcclxuICAgICAgICAgICAgXCJtb3RpdmF0aW9uXCI6IG51bGwsXHJcbiAgICAgICAgICAgIFwic3RhcnREYXRlXCI6IFwiMDItMDItMjAxNlwiLFxyXG4gICAgICAgICAgICBcImVuZERhdGVcIjogXCIwNC0wOC0yMDE2XCIsXHJcbiAgICAgICAgICAgIFwic3RlcHNcIjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDFcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVnJhZ2VuIHN0ZWxsZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCB2cmFhZ3QgZWVuIG1lZGVzdHVkZW50IG9tIHppam4gbWVuaW5nLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIwMi0wMi0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJDb21wbGltZW50ZW4gdm9vciA1IHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQgaGVlZnQgNSB3ZWtlbiBsYW5nIGVsa2Ugd2VlayBlZW4gY29tcGxpbWVudCBhYW4gZWVuIG1lZGVzdHVkZW50IGdlZ2V2ZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjEyLTAzLTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjEyIGNvbXBsaW1lbnRlbiBpbiA0IHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIGxlZXJsaW5nIGhlZWZ0IDQgd2VrZW4gbGFuZyBlbGtlIHdlZWsgMyBjb21wbGltZW50ZW4gZ2VnZXZlbiBhYW4gbWVkZXN0dWRlbnRlbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJkb2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjI5LTA1LTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjIxIGNvbXBsaW1lbnRlbiBpbiAzIHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIjMgd2VrZW4gbGFuZyBoZWVmdCBkZSBzdHVkZW50IGVsa2UgZGFnIGVlbiBjb21wbGltZW50IGdlZ2V2ZW4gYWFuIGVlbiBtZWRlc3R1ZGVudC5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJkb2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjE0LTA3LTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0MlwiLFxyXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiRGUgcmVrZW50YWZlbHMga2VubmVuXCIsXHJcbiAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBzdHVkZW50IGtlbnQgZGUgdGFmZWxzIHZhbiAxIHRvdCBlbiBtZXQgMTAgdWl0IHppam4gaG9vZmQuXCIsXHJcbiAgICAgICAgICAgIFwiaWNvblwiOiBcImlvbi1jYWxjdWxhdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZG9uZVwiOiBcImRvaW5nXCIsXHJcbiAgICAgICAgICAgIFwibW90aXZhdGlvblwiOiBudWxsLFxyXG4gICAgICAgICAgICBcInN0YXJ0RGF0ZVwiOiBcIjAxLTAxLTIwMTZcIixcclxuICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMDQtMDUtMjAxNlwiLFxyXG4gICAgICAgICAgICBcInN0ZXBzXCI6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRhZmVscyAxLCAyIGVuIDNcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgbGVlcmxpbmcgbW9ldCBkZSB0YWZlbCB2YW4gMSwgMiBlbiAzIHVpdCB6aWpuIGhvb2ZkIGtlbm5lbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMjEtMDItMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDJcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVGFmZWxzIDQgZW4gNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBsZWVybGluZyBtb2V0IGRlIHRhZmVscyB2YW4gMSB0b3QgZW4gbWV0IDUgdWl0IHppam4gaG9vZmQga2VubmVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImJhZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjAyLTAzLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRhZmVscyA2IGVuIDdcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgbGVlcmxpbmcgbW9ldCBkZSB0YWZlbHMgdmFuIDEgdG90IGVuIG1ldCA3IHVpdCB6aWpuIGhvb2ZkIGtlbm5lbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJkb2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjI5LTAzLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRhZmVscyA4IGVuIDlcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiVGFmZWxzIDggZW4gOSB6aWpuIGVyZyBtb2VpbGlqayBlbiBtb2V0ZW4gb29rIGdlbGVlcmQgd29yZGVuLiBEZSBsZWVybGluZyBtb2V0IGRlIHRhZmVscyB2YW4gMSB0b3QgZW4gbWV0IDcgdWl0IHppam4gaG9vZmQga2VubmVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImRvaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMjEtMDQtMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDVcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVGFmZWwgdmFuIDEwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIjEwIGlzIHZyaWogbWFra2VsaWprLiBEZXplIG1vZXQgb29rIGdlbGVlcmQgd29yZGVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImRvaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMDQtMDUtMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJpZFwiOiBcInQzXCIsXHJcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJIZXQgV2lsaGVsbXVzIGtlbm5lblwiLFxyXG4gICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBrZW50IGhldCBXaWxoZWxtdXMgdWl0IHppam4gaG9vZmQuXCIsXHJcbiAgICAgICAgICAgIFwiaWNvblwiOiBcImlvbi12b2x1bWUtaGlnaFwiLFxyXG4gICAgICAgICAgICBcImRvbmVcIjogXCJkb2luZ1wiLFxyXG4gICAgICAgICAgICBcIm1vdGl2YXRpb25cIjogbnVsbCxcclxuICAgICAgICAgICAgXCJzdGFydERhdGVcIjogXCIwMS0wMi0yMDE2XCIsXHJcbiAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjAxLTA0LTIwMTZcIixcclxuICAgICAgICAgICAgXCJzdGVwc1wiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJFZXJzdGUgY291cGxldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBsZWVybGluZyBrZW50IGhldCBlZXJzdGUgY291cGxldCB1aXQgemlqbiBob29mZCBrZW5uZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjE1LTAyLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkVlcnN0ZSByZWZyZWluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIGxlZXJsaW5nIGtlbnQgaGV0IGVlcnN0ZSByZWZyZWluIHVpdCB6aWpuIGhvb2ZkIGtlbm5lbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMDEtMDMtMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDNcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVHdlZWRlIGNvdXBsZXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgbGVlcmxpbmcga2VudCBoZXQgdHdlZWRlIGNvdXBsZXQgdWl0IHppam4gaG9vZmQga2VubmVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIxMS0wMy0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0NFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJUd2VlZGUgcmVmcmVpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBsZWVybGluZyBrZW50IGhldCB0d2VlZGUgcmVmcmVpbiB1aXQgemlqbiBob29mZCBrZW5uZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjIyLTAzLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkRlcmRlIGNvdXBsZXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgbGVlcmxpbmcga2VudCBoZXQgZGVyZGUgY291cGxldCB1aXQgemlqbiBob29mZCBrZW5uZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZG9pbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIwMS0wNC0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcImlkXCI6IFwidDRcIixcclxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIk1pbmRlciBwcmF0ZW4gdGlqZGVucyBkZSBsZXNcIixcclxuICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQga2FuIHppY2ggbGFuZ2VyZSB0aWpkIHN0aWwgaG91ZGVuIGluIGRlIGxlcy4gSGllcmJpaiBpcyBoZXQgZG9lbCBvbSAxNSBtaW51dGVuIGxhbmcgbmlrcyB0ZSB6ZWdnZW5cIixcclxuICAgICAgICAgICAgXCJpY29uXCI6IFwiaW9uLXZvbHVtZS1sb3dcIixcclxuICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICBcIm1vdGl2YXRpb25cIjogNCxcclxuICAgICAgICAgICAgXCJzdGFydERhdGVcIjogXCIyOS0wMS0yMDE2XCIsXHJcbiAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjA1LTAzLTIwMTZcIixcclxuICAgICAgICAgICAgXCJzdGVwc1wiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCI0eDIgbWluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIjQga2VlciAyIG1pbiBpbiBkZSBsZXMgbmlrcyB6ZWdnZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMTAtMDItMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDJcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiNHgzIG1pblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCI0IGtlZXIgMyBtaW4gaW4gZGUgbGVzIG5pa3MgemVnZ2VuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIxMi0wMi0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0M1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCIyeDUgbWluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIjIga2VlciBtb2V0IGluIGRlIGxlcyA1IG1pbnV0ZW4gbGFuZyBuaWtzIGdlemVnZCB3b3JkZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjE3LTAyLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjJ4NyBtaW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBtb2V0IGluIGRlIGxlcyA3IG1pbnV0ZW4gbGFuZyBuaWtzIHplZ2dlbi4gRGl0IG1vZXQgdGlqZGVucyBlZW4gbGVzIDIga2VlciBnZWRhYW4gd29yZGVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIyNS0wMi0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0NVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCIxeDEwIG1pblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCIxIGtlZXIgc3RpbCB6aWpuIDEwIG1pbnV0ZW4gbGFuZy5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMjktMDItMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDZcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiMXgxNSBtaW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBtb2V0IGVlbiBrd2FydGllciBsYW5nIHN0aWwgemlqbiB0aWpkZW5zIGRlIGxlcy5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMDUtMDMtMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJpZFwiOiBcInQ1XCIsXHJcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJQbGFubmluZyBuYWtvbWVuXCIsXHJcbiAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBzdHVkZW50IGthbiBkZSBwbGFubmluZyBuYWtvbWVuIGRpZSBoZW0gYWFuIGhldCBiZWdpbiB2YW4gZGUgbWFhbmQgZ2VnZXZlbiBpcywgbmFrb21lbi5cIixcclxuICAgICAgICAgICAgXCJpY29uXCI6IFwiaW9uLWNhbGVuZGFyXCIsXHJcbiAgICAgICAgICAgIFwiZG9uZVwiOiBcImJhZFwiLFxyXG4gICAgICAgICAgICBcIm1vdGl2YXRpb25cIjogMSxcclxuICAgICAgICAgICAgXCJzdGFydERhdGVcIjogXCIwMS0wNy0yMDE1XCIsXHJcbiAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjMxLTAxLTIwMTZcIixcclxuICAgICAgICAgICAgXCJzdGVwc1wiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCI0IHZhbiBkZSAxMCB0YWtlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBYW4gaGV0IGVpbmQgdmFuIGRlIG1hYW5kIG1vZXRlbiA0IHZhbiBkZSAxMCB0YWtlbiBhZiB6aWpuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0wNy0yMDE1XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCI1IHZhbiBkZSAxMCB0YWtlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBoZWxmdCB2YW4gZGUgdGFrZW4gbW9ldCBhYW4gaGV0IGVpbmQgdmFuIGRlIG1hYW5kIGFmIHppam4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiYmFkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMzEtMDgtMjAxNVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDNcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiNiB2YW4gZGUgMTAgdGFrZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiNiB0YWtlbiBtb2V0ZW4gYWFuIGhldCBlaW5kIHZhbiBkZSBtYWFuZCBhZiB6aWpuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImJhZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjMxLTA5LTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjcgdmFuIGRlIDEwIHRha2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQgbW9ldCA3IHRha2VuIHZhbiBkZSAxMCBhZiBoZWJiZW4gYWFuIGhldCBlaW5kZSB2YW4gZGUgbWFhbmQuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiYmFkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMzEtMTAtMjAxNVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDVcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiOCB2YW4gZGUgMTAgdGFrZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQWFuIGhldCBlaW5kZSB2YW4gZGUgbWFhbmQgbW9ldGVuIDggdGFrZW4gYWYgemlqbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJiYWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0xMS0yMDE1XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0NlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCI5IHZhbiBkZSAxMCB0YWtlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCI5IHZhbiBkZSAxMCB0YWtlbiBtb2V0ZW4gemlqbiBhZmdlcm9uZCBhYW4gaGV0IGVpbmRlIHZhbiBkZSBtYWFuZC5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJiYWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0xMi0yMDE1XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0N1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCIxMCB2YW4gZGUgMTAgdGFrZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBtb2V0IHppam4gcGxhbm5pbmcgdm9sbGVkaWcgaGViYmVuIG5hZ2Vrb21lbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJiYWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0wMS0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcImlkXCI6IFwidDZcIixcclxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkNvbXBsaW1lbnRlbiBnZXZlblwiLFxyXG4gICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBtb2V0IGRhZ2VsaWprcyBlZW4gY29tcGxpbWVudCBnZXZlbiBhYW4gZWVuIG1lZGVsZWVybGluZ1wiLFxyXG4gICAgICAgICAgICBcImljb25cIjogXCJpb24tYW5kcm9pZC1jb250YWN0c1wiLFxyXG4gICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgIFwibW90aXZhdGlvblwiOiA1LFxyXG4gICAgICAgICAgICBcInN0YXJ0RGF0ZVwiOiBcIjE5LTExLTIwMTRcIixcclxuICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMTAtMDUtMjAxNVwiLFxyXG4gICAgICAgICAgICBcInN0ZXBzXCI6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkVlcnN0ZSBjb21wbGltZW50XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIGxlZXJsaW5nIGhlZWZ0IGVlbiBtZWRlc3R1ZGVudCBlZW4gY29tcGxpbWVudCBnZWdldmVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0xMi0yMDE0XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJDb21wbGltZW50ZW4gdm9vciA1IHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQgaGVlZnQgNSB3ZWtlbiBsYW5nIGVsa2Ugd2VlayBlZW4gY29tcGxpbWVudCBhYW4gZWVuIG1lZGVzdHVkZW50IGdlZ2V2ZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjEyLTAzLTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjEyIGNvbXBsaW1lbnRlbiBpbiA0IHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIGxlZXJsaW5nIGhlZWZ0IDQgd2VrZW4gbGFuZyBlbGtlIHdlZWsgMyBjb21wbGltZW50ZW4gZ2VnZXZlbiBhYW4gbWVkZXN0dWRlbnRlbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMjktMDUtMjAxNVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDRcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiMjEgY29tcGxpbWVudGVuIGluIDMgd2VrZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiMyB3ZWtlbiBsYW5nIGhlZWZ0IGRlIHN0dWRlbnQgZWxrZSBkYWcgZWVuIGNvbXBsaW1lbnQgZ2VnZXZlbiBhYW4gZWVuIG1lZGVzdHVkZW50LlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIxNC0wNy0yMDE1XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgZGF0YUNhbGxlci5nZXREb2VsZW4gPSBmdW5jdGlvbihzdHVkZW50SUQsIG9uU3VjY2VzKXsgICAgXHJcbiAgICAgICAgb25TdWNjZXMoZGF0YUNhbGxlci50ZXN0UmVzdWx0KTtcclxuICAgIH07XHJcblxyXG4gICAgZGF0YUNhbGxlci5nZXREb2VsID0gZnVuY3Rpb24oc3R1ZGVudElELCBkb2VsSUQsIG9uU3VjY2VzKXtcclxuICAgICAgICB2YXIgZG9lbCA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZGF0YUNhbGxlci50ZXN0UmVzdWx0LmZvckVhY2goZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgaWYob2JqZWN0LmlkID09PSBkb2VsSUQpe1xyXG4gICAgICAgICAgICAgICAgZG9lbCA9IG9iamVjdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG9uU3VjY2VzKGRvZWwpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgZGF0YUNhbGxlci5nZXRTdGFwID0gZnVuY3Rpb24oc3R1ZGVudElELCBkb2VsSUQsIHN0YXBJRCwgb25TdWNjZXMpe1xyXG4gICAgICAgIHZhciBzdGFwID0gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBkYXRhQ2FsbGVyLnRlc3RSZXN1bHQuZm9yRWFjaChmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICAgICAgICBpZihvYmplY3QuaWQgPT09IGRvZWxJRCl7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Quc3RlcHMuZm9yRWFjaChmdW5jdGlvbihvYmplY3QyKXtcclxuICAgICAgICAgICAgICAgIGlmKG9iamVjdDIuaWQgPT09IHN0YXBJRCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcCA9IG9iamVjdDI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG9uU3VjY2VzKHN0YXApO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2VsZi5nZXREb2VsZW4gPSBmdW5jdGlvbihzdHVkZW50SUQsIG9uU3VjY2VzKXtcclxuICAgICAgICBkYXRhQ2FsbGVyLmdldERvZWxlbihzdHVkZW50SUQsIG9uU3VjY2VzKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNlbGYuZ2V0RG9lbCA9IGZ1bmN0aW9uKHN0dWRlbnRJRCwgZG9lbElELCBvblN1Y2Nlcyl7XHJcbiAgICAgICAgZGF0YUNhbGxlci5nZXREb2VsKHN0dWRlbnRJRCwgZG9lbElELCBvblN1Y2Nlcyk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBzZWxmLmdldFN0YXAgPSBmdW5jdGlvbihzdHVkZW50SUQsIGRvZWxJRCwgc3RhcElELCBvblN1Y2Nlcyl7XHJcbiAgICAgICAgZGF0YUNhbGxlci5nZXRTdGFwKHN0dWRlbnRJRCwgZG9lbElELCBzdGFwSUQsIG9uU3VjY2VzKTtcclxuICAgIH07XHJcblxyXG5cdHJldHVybiB7XHJcbiAgICAgICAgZ2V0RG9lbGVuOiBzZWxmLmdldERvZWxlbixcclxuICAgICAgICBnZXREb2VsOiBzZWxmLmdldERvZWwsXHJcbiAgICAgICAgZ2V0U3RhcDogc2VsZi5nZXRTdGFwXHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpb25pY1Njcm9sbERlbGVnYXRlLCAkcm91dGVQYXJhbXMsIEFsbERhdGEsIERvZWxlblNlcnZpY2UpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XHJcbiAgICBcclxuICAgIERvZWxlblNlcnZpY2UuZ2V0U3RhcChcInRlc3RcIiwgJHJvdXRlUGFyYW1zLmRvZWxJRCwgJHJvdXRlUGFyYW1zLnN0YXBJRCwgZnVuY3Rpb24ocmVzdWx0KXtcclxuICAgICAgICBzd2l0Y2gocmVzdWx0LmRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJnb29kXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmRvbmVDb2xvciA9IFwiYmFsYW5jZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJiYWRcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZG9uZUNvbG9yID0gXCJhc3NlcnRpdmVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmRvbmVDb2xvciA9IFwicG9zaXRpdmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHNlbGYuc3RhcCA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGlvbmljU2Nyb2xsRGVsZWdhdGUsIEFsbERhdGEpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XHJcbiAgICBcclxuICAgIHNlbGYuZG9lbHNjcmVlbiA9IEFsbERhdGEucHJlZi5kb2Vsc2NyZWVuO1xyXG4gICAgc2VsZi50ZXh0SWNvbnMgPSBBbGxEYXRhLnByZWYudGV4dEljb25zO1xyXG4gICAgc2VsZi50aGVtYSA9IFwiZGVmYXVsdFwiO1xyXG59OyIsIi8qKlxuICogQGxpY2Vuc2UgQW5ndWxhckpTIHYxLjUuNVxuICogKGMpIDIwMTAtMjAxNiBHb29nbGUsIEluYy4gaHR0cDovL2FuZ3VsYXJqcy5vcmdcbiAqIExpY2Vuc2U6IE1JVFxuICovXG4oZnVuY3Rpb24od2luZG93LCBhbmd1bGFyKSB7J3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBtb2R1bGVcbiAqIEBuYW1lIG5nUm91dGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqICMgbmdSb3V0ZVxuICpcbiAqIFRoZSBgbmdSb3V0ZWAgbW9kdWxlIHByb3ZpZGVzIHJvdXRpbmcgYW5kIGRlZXBsaW5raW5nIHNlcnZpY2VzIGFuZCBkaXJlY3RpdmVzIGZvciBhbmd1bGFyIGFwcHMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU2VlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSNleGFtcGxlICRyb3V0ZX0gZm9yIGFuIGV4YW1wbGUgb2YgY29uZmlndXJpbmcgYW5kIHVzaW5nIGBuZ1JvdXRlYC5cbiAqXG4gKlxuICogPGRpdiBkb2MtbW9kdWxlLWNvbXBvbmVudHM9XCJuZ1JvdXRlXCI+PC9kaXY+XG4gKi9cbiAvKiBnbG9iYWwgLW5nUm91dGVNb2R1bGUgKi9cbnZhciBuZ1JvdXRlTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25nUm91dGUnLCBbJ25nJ10pLlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIoJyRyb3V0ZScsICRSb3V0ZVByb3ZpZGVyKSxcbiAgICAkcm91dGVNaW5FcnIgPSBhbmd1bGFyLiQkbWluRXJyKCduZ1JvdXRlJyk7XG5cbi8qKlxuICogQG5nZG9jIHByb3ZpZGVyXG4gKiBAbmFtZSAkcm91dGVQcm92aWRlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFVzZWQgZm9yIGNvbmZpZ3VyaW5nIHJvdXRlcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTZWUge0BsaW5rIG5nUm91dGUuJHJvdXRlI2V4YW1wbGUgJHJvdXRlfSBmb3IgYW4gZXhhbXBsZSBvZiBjb25maWd1cmluZyBhbmQgdXNpbmcgYG5nUm91dGVgLlxuICpcbiAqICMjIERlcGVuZGVuY2llc1xuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqL1xuZnVuY3Rpb24gJFJvdXRlUHJvdmlkZXIoKSB7XG4gIGZ1bmN0aW9uIGluaGVyaXQocGFyZW50LCBleHRyYSkge1xuICAgIHJldHVybiBhbmd1bGFyLmV4dGVuZChPYmplY3QuY3JlYXRlKHBhcmVudCksIGV4dHJhKTtcbiAgfVxuXG4gIHZhciByb3V0ZXMgPSB7fTtcblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm91dGVQcm92aWRlciN3aGVuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFJvdXRlIHBhdGggKG1hdGNoZWQgYWdhaW5zdCBgJGxvY2F0aW9uLnBhdGhgKS4gSWYgYCRsb2NhdGlvbi5wYXRoYFxuICAgKiAgICBjb250YWlucyByZWR1bmRhbnQgdHJhaWxpbmcgc2xhc2ggb3IgaXMgbWlzc2luZyBvbmUsIHRoZSByb3V0ZSB3aWxsIHN0aWxsIG1hdGNoIGFuZCB0aGVcbiAgICogICAgYCRsb2NhdGlvbi5wYXRoYCB3aWxsIGJlIHVwZGF0ZWQgdG8gYWRkIG9yIGRyb3AgdGhlIHRyYWlsaW5nIHNsYXNoIHRvIGV4YWN0bHkgbWF0Y2ggdGhlXG4gICAqICAgIHJvdXRlIGRlZmluaXRpb24uXG4gICAqXG4gICAqICAgICogYHBhdGhgIGNhbiBjb250YWluIG5hbWVkIGdyb3VwcyBzdGFydGluZyB3aXRoIGEgY29sb246IGUuZy4gYDpuYW1lYC4gQWxsIGNoYXJhY3RlcnMgdXBcbiAgICogICAgICAgIHRvIHRoZSBuZXh0IHNsYXNoIGFyZSBtYXRjaGVkIGFuZCBzdG9yZWQgaW4gYCRyb3V0ZVBhcmFtc2AgdW5kZXIgdGhlIGdpdmVuIGBuYW1lYFxuICAgKiAgICAgICAgd2hlbiB0aGUgcm91dGUgbWF0Y2hlcy5cbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gbmFtZWQgZ3JvdXBzIHN0YXJ0aW5nIHdpdGggYSBjb2xvbiBhbmQgZW5kaW5nIHdpdGggYSBzdGFyOlxuICAgKiAgICAgICAgZS5nLmA6bmFtZSpgLiBBbGwgY2hhcmFjdGVycyBhcmUgZWFnZXJseSBzdG9yZWQgaW4gYCRyb3V0ZVBhcmFtc2AgdW5kZXIgdGhlIGdpdmVuIGBuYW1lYFxuICAgKiAgICAgICAgd2hlbiB0aGUgcm91dGUgbWF0Y2hlcy5cbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gb3B0aW9uYWwgbmFtZWQgZ3JvdXBzIHdpdGggYSBxdWVzdGlvbiBtYXJrOiBlLmcuYDpuYW1lP2AuXG4gICAqXG4gICAqICAgIEZvciBleGFtcGxlLCByb3V0ZXMgbGlrZSBgL2NvbG9yLzpjb2xvci9sYXJnZWNvZGUvOmxhcmdlY29kZSpcXC9lZGl0YCB3aWxsIG1hdGNoXG4gICAqICAgIGAvY29sb3IvYnJvd24vbGFyZ2Vjb2RlL2NvZGUvd2l0aC9zbGFzaGVzL2VkaXRgIGFuZCBleHRyYWN0OlxuICAgKlxuICAgKiAgICAqIGBjb2xvcjogYnJvd25gXG4gICAqICAgICogYGxhcmdlY29kZTogY29kZS93aXRoL3NsYXNoZXNgLlxuICAgKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcm91dGUgTWFwcGluZyBpbmZvcm1hdGlvbiB0byBiZSBhc3NpZ25lZCB0byBgJHJvdXRlLmN1cnJlbnRgIG9uIHJvdXRlXG4gICAqICAgIG1hdGNoLlxuICAgKlxuICAgKiAgICBPYmplY3QgcHJvcGVydGllczpcbiAgICpcbiAgICogICAgLSBgY29udHJvbGxlcmAg4oCTIGB7KHN0cmluZ3xmdW5jdGlvbigpPX1gIOKAkyBDb250cm9sbGVyIGZuIHRoYXQgc2hvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aFxuICAgKiAgICAgIG5ld2x5IGNyZWF0ZWQgc2NvcGUgb3IgdGhlIG5hbWUgb2YgYSB7QGxpbmsgYW5ndWxhci5Nb2R1bGUjY29udHJvbGxlciByZWdpc3RlcmVkXG4gICAqICAgICAgY29udHJvbGxlcn0gaWYgcGFzc2VkIGFzIGEgc3RyaW5nLlxuICAgKiAgICAtIGBjb250cm9sbGVyQXNgIOKAkyBge3N0cmluZz19YCDigJMgQW4gaWRlbnRpZmllciBuYW1lIGZvciBhIHJlZmVyZW5jZSB0byB0aGUgY29udHJvbGxlci5cbiAgICogICAgICBJZiBwcmVzZW50LCB0aGUgY29udHJvbGxlciB3aWxsIGJlIHB1Ymxpc2hlZCB0byBzY29wZSB1bmRlciB0aGUgYGNvbnRyb2xsZXJBc2AgbmFtZS5cbiAgICogICAgLSBgdGVtcGxhdGVgIOKAkyBge3N0cmluZz18ZnVuY3Rpb24oKT19YCDigJMgaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyBvciBhIGZ1bmN0aW9uIHRoYXRcbiAgICogICAgICByZXR1cm5zIGFuIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgd2hpY2ggc2hvdWxkIGJlIHVzZWQgYnkge0BsaW5rXG4gICAqICAgICAgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30gb3Ige0BsaW5rIG5nLmRpcmVjdGl2ZTpuZ0luY2x1ZGUgbmdJbmNsdWRlfSBkaXJlY3RpdmVzLlxuICAgKiAgICAgIFRoaXMgcHJvcGVydHkgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIGB0ZW1wbGF0ZVVybGAuXG4gICAqXG4gICAqICAgICAgSWYgYHRlbXBsYXRlYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7QXJyYXkuPE9iamVjdD59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZVxuICAgKlxuICAgKiAgICAtIGB0ZW1wbGF0ZVVybGAg4oCTIGB7c3RyaW5nPXxmdW5jdGlvbigpPX1gIOKAkyBwYXRoIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHBhdGggdG8gYW4gaHRtbFxuICAgKiAgICAgIHRlbXBsYXRlIHRoYXQgc2hvdWxkIGJlIHVzZWQgYnkge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9LlxuICAgKlxuICAgKiAgICAgIElmIGB0ZW1wbGF0ZVVybGAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgICAgLSBge0FycmF5LjxPYmplY3Q+fWAgLSByb3V0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICAgICAgICBgJGxvY2F0aW9uLnBhdGgoKWAgYnkgYXBwbHlpbmcgdGhlIGN1cnJlbnQgcm91dGVcbiAgICpcbiAgICogICAgLSBgcmVzb2x2ZWAgLSBge09iamVjdC48c3RyaW5nLCBmdW5jdGlvbj49fWAgLSBBbiBvcHRpb25hbCBtYXAgb2YgZGVwZW5kZW5jaWVzIHdoaWNoIHNob3VsZFxuICAgKiAgICAgIGJlIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuIElmIGFueSBvZiB0aGVzZSBkZXBlbmRlbmNpZXMgYXJlIHByb21pc2VzLCB0aGUgcm91dGVyXG4gICAqICAgICAgd2lsbCB3YWl0IGZvciB0aGVtIGFsbCB0byBiZSByZXNvbHZlZCBvciBvbmUgdG8gYmUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBjb250cm9sbGVyIGlzXG4gICAqICAgICAgaW5zdGFudGlhdGVkLlxuICAgKiAgICAgIElmIGFsbCB0aGUgcHJvbWlzZXMgYXJlIHJlc29sdmVkIHN1Y2Nlc3NmdWxseSwgdGhlIHZhbHVlcyBvZiB0aGUgcmVzb2x2ZWQgcHJvbWlzZXMgYXJlXG4gICAqICAgICAgaW5qZWN0ZWQgYW5kIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSMkcm91dGVDaGFuZ2VTdWNjZXNzICRyb3V0ZUNoYW5nZVN1Y2Nlc3N9IGV2ZW50IGlzXG4gICAqICAgICAgZmlyZWQuIElmIGFueSBvZiB0aGUgcHJvbWlzZXMgYXJlIHJlamVjdGVkIHRoZVxuICAgKiAgICAgIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSMkcm91dGVDaGFuZ2VFcnJvciAkcm91dGVDaGFuZ2VFcnJvcn0gZXZlbnQgaXMgZmlyZWQuXG4gICAqICAgICAgRm9yIGVhc2llciBhY2Nlc3MgdG8gdGhlIHJlc29sdmVkIGRlcGVuZGVuY2llcyBmcm9tIHRoZSB0ZW1wbGF0ZSwgdGhlIGByZXNvbHZlYCBtYXAgd2lsbFxuICAgKiAgICAgIGJlIGF2YWlsYWJsZSBvbiB0aGUgc2NvcGUgb2YgdGhlIHJvdXRlLCB1bmRlciBgJHJlc29sdmVgIChieSBkZWZhdWx0KSBvciBhIGN1c3RvbSBuYW1lXG4gICAqICAgICAgc3BlY2lmaWVkIGJ5IHRoZSBgcmVzb2x2ZUFzYCBwcm9wZXJ0eSAoc2VlIGJlbG93KS4gVGhpcyBjYW4gYmUgcGFydGljdWxhcmx5IHVzZWZ1bCwgd2hlblxuICAgKiAgICAgIHdvcmtpbmcgd2l0aCB7QGxpbmsgYW5ndWxhci5Nb2R1bGUjY29tcG9uZW50IGNvbXBvbmVudHN9IGFzIHJvdXRlIHRlbXBsYXRlcy48YnIgLz5cbiAgICogICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtd2FybmluZ1wiPlxuICAgKiAgICAgICAgKipOb3RlOioqIElmIHlvdXIgc2NvcGUgYWxyZWFkeSBjb250YWlucyBhIHByb3BlcnR5IHdpdGggdGhpcyBuYW1lLCBpdCB3aWxsIGJlIGhpZGRlblxuICAgKiAgICAgICAgb3Igb3ZlcndyaXR0ZW4uIE1ha2Ugc3VyZSwgeW91IHNwZWNpZnkgYW4gYXBwcm9wcmlhdGUgbmFtZSBmb3IgdGhpcyBwcm9wZXJ0eSwgdGhhdFxuICAgKiAgICAgICAgZG9lcyBub3QgY29sbGlkZSB3aXRoIG90aGVyIHByb3BlcnRpZXMgb24gdGhlIHNjb3BlLlxuICAgKiAgICAgIDwvZGl2PlxuICAgKiAgICAgIFRoZSBtYXAgb2JqZWN0IGlzOlxuICAgKlxuICAgKiAgICAgIC0gYGtleWAg4oCTIGB7c3RyaW5nfWA6IGEgbmFtZSBvZiBhIGRlcGVuZGVuY3kgdG8gYmUgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci5cbiAgICogICAgICAtIGBmYWN0b3J5YCAtIGB7c3RyaW5nfGZ1bmN0aW9ufWA6IElmIGBzdHJpbmdgIHRoZW4gaXQgaXMgYW4gYWxpYXMgZm9yIGEgc2VydmljZS5cbiAgICogICAgICAgIE90aGVyd2lzZSBpZiBmdW5jdGlvbiwgdGhlbiBpdCBpcyB7QGxpbmsgYXV0by4kaW5qZWN0b3IjaW52b2tlIGluamVjdGVkfVxuICAgKiAgICAgICAgYW5kIHRoZSByZXR1cm4gdmFsdWUgaXMgdHJlYXRlZCBhcyB0aGUgZGVwZW5kZW5jeS4gSWYgdGhlIHJlc3VsdCBpcyBhIHByb21pc2UsIGl0IGlzXG4gICAqICAgICAgICByZXNvbHZlZCBiZWZvcmUgaXRzIHZhbHVlIGlzIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuIEJlIGF3YXJlIHRoYXRcbiAgICogICAgICAgIGBuZ1JvdXRlLiRyb3V0ZVBhcmFtc2Agd2lsbCBzdGlsbCByZWZlciB0byB0aGUgcHJldmlvdXMgcm91dGUgd2l0aGluIHRoZXNlIHJlc29sdmVcbiAgICogICAgICAgIGZ1bmN0aW9ucy4gIFVzZSBgJHJvdXRlLmN1cnJlbnQucGFyYW1zYCB0byBhY2Nlc3MgdGhlIG5ldyByb3V0ZSBwYXJhbWV0ZXJzLCBpbnN0ZWFkLlxuICAgKlxuICAgKiAgICAtIGByZXNvbHZlQXNgIC0gYHtzdHJpbmc9fWAgLSBUaGUgbmFtZSB1bmRlciB3aGljaCB0aGUgYHJlc29sdmVgIG1hcCB3aWxsIGJlIGF2YWlsYWJsZSBvblxuICAgKiAgICAgIHRoZSBzY29wZSBvZiB0aGUgcm91dGUuIElmIG9taXR0ZWQsIGRlZmF1bHRzIHRvIGAkcmVzb2x2ZWAuXG4gICAqXG4gICAqICAgIC0gYHJlZGlyZWN0VG9gIOKAkyBgeyhzdHJpbmd8ZnVuY3Rpb24oKSk9fWAg4oCTIHZhbHVlIHRvIHVwZGF0ZVxuICAgKiAgICAgIHtAbGluayBuZy4kbG9jYXRpb24gJGxvY2F0aW9ufSBwYXRoIHdpdGggYW5kIHRyaWdnZXIgcm91dGUgcmVkaXJlY3Rpb24uXG4gICAqXG4gICAqICAgICAgSWYgYHJlZGlyZWN0VG9gIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtPYmplY3QuPHN0cmluZz59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZSB0ZW1wbGF0ZVVybC5cbiAgICogICAgICAtIGB7c3RyaW5nfWAgLSBjdXJyZW50IGAkbG9jYXRpb24ucGF0aCgpYFxuICAgKiAgICAgIC0gYHtPYmplY3R9YCAtIGN1cnJlbnQgYCRsb2NhdGlvbi5zZWFyY2goKWBcbiAgICpcbiAgICogICAgICBUaGUgY3VzdG9tIGByZWRpcmVjdFRvYCBmdW5jdGlvbiBpcyBleHBlY3RlZCB0byByZXR1cm4gYSBzdHJpbmcgd2hpY2ggd2lsbCBiZSB1c2VkXG4gICAqICAgICAgdG8gdXBkYXRlIGAkbG9jYXRpb24ucGF0aCgpYCBhbmQgYCRsb2NhdGlvbi5zZWFyY2goKWAuXG4gICAqXG4gICAqICAgIC0gYFtyZWxvYWRPblNlYXJjaD10cnVlXWAgLSBge2Jvb2xlYW49fWAgLSByZWxvYWQgcm91dGUgd2hlbiBvbmx5IGAkbG9jYXRpb24uc2VhcmNoKClgXG4gICAqICAgICAgb3IgYCRsb2NhdGlvbi5oYXNoKClgIGNoYW5nZXMuXG4gICAqXG4gICAqICAgICAgSWYgdGhlIG9wdGlvbiBpcyBzZXQgdG8gYGZhbHNlYCBhbmQgdXJsIGluIHRoZSBicm93c2VyIGNoYW5nZXMsIHRoZW5cbiAgICogICAgICBgJHJvdXRlVXBkYXRlYCBldmVudCBpcyBicm9hZGNhc3RlZCBvbiB0aGUgcm9vdCBzY29wZS5cbiAgICpcbiAgICogICAgLSBgW2Nhc2VJbnNlbnNpdGl2ZU1hdGNoPWZhbHNlXWAgLSBge2Jvb2xlYW49fWAgLSBtYXRjaCByb3V0ZXMgd2l0aG91dCBiZWluZyBjYXNlIHNlbnNpdGl2ZVxuICAgKlxuICAgKiAgICAgIElmIHRoZSBvcHRpb24gaXMgc2V0IHRvIGB0cnVlYCwgdGhlbiB0aGUgcGFydGljdWxhciByb3V0ZSBjYW4gYmUgbWF0Y2hlZCB3aXRob3V0IGJlaW5nXG4gICAqICAgICAgY2FzZSBzZW5zaXRpdmVcbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gc2VsZlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQWRkcyBhIG5ldyByb3V0ZSBkZWZpbml0aW9uIHRvIHRoZSBgJHJvdXRlYCBzZXJ2aWNlLlxuICAgKi9cbiAgdGhpcy53aGVuID0gZnVuY3Rpb24ocGF0aCwgcm91dGUpIHtcbiAgICAvL2NvcHkgb3JpZ2luYWwgcm91dGUgb2JqZWN0IHRvIHByZXNlcnZlIHBhcmFtcyBpbmhlcml0ZWQgZnJvbSBwcm90byBjaGFpblxuICAgIHZhciByb3V0ZUNvcHkgPSBhbmd1bGFyLmNvcHkocm91dGUpO1xuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHJvdXRlQ29weS5yZWxvYWRPblNlYXJjaCkpIHtcbiAgICAgIHJvdXRlQ29weS5yZWxvYWRPblNlYXJjaCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHJvdXRlQ29weS5jYXNlSW5zZW5zaXRpdmVNYXRjaCkpIHtcbiAgICAgIHJvdXRlQ29weS5jYXNlSW5zZW5zaXRpdmVNYXRjaCA9IHRoaXMuY2FzZUluc2Vuc2l0aXZlTWF0Y2g7XG4gICAgfVxuICAgIHJvdXRlc1twYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgcm91dGVDb3B5LFxuICAgICAgcGF0aCAmJiBwYXRoUmVnRXhwKHBhdGgsIHJvdXRlQ29weSlcbiAgICApO1xuXG4gICAgLy8gY3JlYXRlIHJlZGlyZWN0aW9uIGZvciB0cmFpbGluZyBzbGFzaGVzXG4gICAgaWYgKHBhdGgpIHtcbiAgICAgIHZhciByZWRpcmVjdFBhdGggPSAocGF0aFtwYXRoLmxlbmd0aCAtIDFdID09ICcvJylcbiAgICAgICAgICAgID8gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGggLSAxKVxuICAgICAgICAgICAgOiBwYXRoICsgJy8nO1xuXG4gICAgICByb3V0ZXNbcmVkaXJlY3RQYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgICB7cmVkaXJlY3RUbzogcGF0aH0sXG4gICAgICAgIHBhdGhSZWdFeHAocmVkaXJlY3RQYXRoLCByb3V0ZUNvcHkpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjY2FzZUluc2Vuc2l0aXZlTWF0Y2hcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEEgYm9vbGVhbiBwcm9wZXJ0eSBpbmRpY2F0aW5nIGlmIHJvdXRlcyBkZWZpbmVkXG4gICAqIHVzaW5nIHRoaXMgcHJvdmlkZXIgc2hvdWxkIGJlIG1hdGNoZWQgdXNpbmcgYSBjYXNlIGluc2Vuc2l0aXZlXG4gICAqIGFsZ29yaXRobS4gRGVmYXVsdHMgdG8gYGZhbHNlYC5cbiAgICovXG4gIHRoaXMuY2FzZUluc2Vuc2l0aXZlTWF0Y2ggPSBmYWxzZTtcblxuICAgLyoqXG4gICAgKiBAcGFyYW0gcGF0aCB7c3RyaW5nfSBwYXRoXG4gICAgKiBAcGFyYW0gb3B0cyB7T2JqZWN0fSBvcHRpb25zXG4gICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICpcbiAgICAqIEBkZXNjcmlwdGlvblxuICAgICogTm9ybWFsaXplcyB0aGUgZ2l2ZW4gcGF0aCwgcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uXG4gICAgKiBhbmQgdGhlIG9yaWdpbmFsIHBhdGguXG4gICAgKlxuICAgICogSW5zcGlyZWQgYnkgcGF0aFJleHAgaW4gdmlzaW9ubWVkaWEvZXhwcmVzcy9saWIvdXRpbHMuanMuXG4gICAgKi9cbiAgZnVuY3Rpb24gcGF0aFJlZ0V4cChwYXRoLCBvcHRzKSB7XG4gICAgdmFyIGluc2Vuc2l0aXZlID0gb3B0cy5jYXNlSW5zZW5zaXRpdmVNYXRjaCxcbiAgICAgICAgcmV0ID0ge1xuICAgICAgICAgIG9yaWdpbmFsUGF0aDogcGF0aCxcbiAgICAgICAgICByZWdleHA6IHBhdGhcbiAgICAgICAgfSxcbiAgICAgICAga2V5cyA9IHJldC5rZXlzID0gW107XG5cbiAgICBwYXRoID0gcGF0aFxuICAgICAgLnJlcGxhY2UoLyhbKCkuXSkvZywgJ1xcXFwkMScpXG4gICAgICAucmVwbGFjZSgvKFxcLyk/OihcXHcrKShcXCpcXD98W1xcP1xcKl0pPy9nLCBmdW5jdGlvbihfLCBzbGFzaCwga2V5LCBvcHRpb24pIHtcbiAgICAgICAgdmFyIG9wdGlvbmFsID0gKG9wdGlvbiA9PT0gJz8nIHx8IG9wdGlvbiA9PT0gJyo/JykgPyAnPycgOiBudWxsO1xuICAgICAgICB2YXIgc3RhciA9IChvcHRpb24gPT09ICcqJyB8fCBvcHRpb24gPT09ICcqPycpID8gJyonIDogbnVsbDtcbiAgICAgICAga2V5cy5wdXNoKHsgbmFtZToga2V5LCBvcHRpb25hbDogISFvcHRpb25hbCB9KTtcbiAgICAgICAgc2xhc2ggPSBzbGFzaCB8fCAnJztcbiAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyAnJyA6IHNsYXNoKVxuICAgICAgICAgICsgJyg/OidcbiAgICAgICAgICArIChvcHRpb25hbCA/IHNsYXNoIDogJycpXG4gICAgICAgICAgKyAoc3RhciAmJiAnKC4rPyknIHx8ICcoW14vXSspJylcbiAgICAgICAgICArIChvcHRpb25hbCB8fCAnJylcbiAgICAgICAgICArICcpJ1xuICAgICAgICAgICsgKG9wdGlvbmFsIHx8ICcnKTtcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZSgvKFtcXC8kXFwqXSkvZywgJ1xcXFwkMScpO1xuXG4gICAgcmV0LnJlZ2V4cCA9IG5ldyBSZWdFeHAoJ14nICsgcGF0aCArICckJywgaW5zZW5zaXRpdmUgPyAnaScgOiAnJyk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRyb3V0ZVByb3ZpZGVyI290aGVyd2lzZVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0cyByb3V0ZSBkZWZpbml0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIG9uIHJvdXRlIGNoYW5nZSB3aGVuIG5vIG90aGVyIHJvdXRlIGRlZmluaXRpb25cbiAgICogaXMgbWF0Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBwYXJhbXMgTWFwcGluZyBpbmZvcm1hdGlvbiB0byBiZSBhc3NpZ25lZCB0byBgJHJvdXRlLmN1cnJlbnRgLlxuICAgKiBJZiBjYWxsZWQgd2l0aCBhIHN0cmluZywgdGhlIHZhbHVlIG1hcHMgdG8gYHJlZGlyZWN0VG9gLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzZWxmXG4gICAqL1xuICB0aGlzLm90aGVyd2lzZSA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIGlmICh0eXBlb2YgcGFyYW1zID09PSAnc3RyaW5nJykge1xuICAgICAgcGFyYW1zID0ge3JlZGlyZWN0VG86IHBhcmFtc307XG4gICAgfVxuICAgIHRoaXMud2hlbihudWxsLCBwYXJhbXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgdGhpcy4kZ2V0ID0gWyckcm9vdFNjb3BlJyxcbiAgICAgICAgICAgICAgICckbG9jYXRpb24nLFxuICAgICAgICAgICAgICAgJyRyb3V0ZVBhcmFtcycsXG4gICAgICAgICAgICAgICAnJHEnLFxuICAgICAgICAgICAgICAgJyRpbmplY3RvcicsXG4gICAgICAgICAgICAgICAnJHRlbXBsYXRlUmVxdWVzdCcsXG4gICAgICAgICAgICAgICAnJHNjZScsXG4gICAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgJHEsICRpbmplY3RvciwgJHRlbXBsYXRlUmVxdWVzdCwgJHNjZSkge1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIHNlcnZpY2VcbiAgICAgKiBAbmFtZSAkcm91dGVcbiAgICAgKiBAcmVxdWlyZXMgJGxvY2F0aW9uXG4gICAgICogQHJlcXVpcmVzICRyb3V0ZVBhcmFtc1xuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtPYmplY3R9IGN1cnJlbnQgUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IHJvdXRlIGRlZmluaXRpb24uXG4gICAgICogVGhlIHJvdXRlIGRlZmluaXRpb24gY29udGFpbnM6XG4gICAgICpcbiAgICAgKiAgIC0gYGNvbnRyb2xsZXJgOiBUaGUgY29udHJvbGxlciBjb25zdHJ1Y3RvciBhcyBkZWZpbmVkIGluIHRoZSByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqICAgLSBgbG9jYWxzYDogQSBtYXAgb2YgbG9jYWxzIHdoaWNoIGlzIHVzZWQgYnkge0BsaW5rIG5nLiRjb250cm9sbGVyICRjb250cm9sbGVyfSBzZXJ2aWNlIGZvclxuICAgICAqICAgICBjb250cm9sbGVyIGluc3RhbnRpYXRpb24uIFRoZSBgbG9jYWxzYCBjb250YWluXG4gICAgICogICAgIHRoZSByZXNvbHZlZCB2YWx1ZXMgb2YgdGhlIGByZXNvbHZlYCBtYXAuIEFkZGl0aW9uYWxseSB0aGUgYGxvY2Fsc2AgYWxzbyBjb250YWluOlxuICAgICAqXG4gICAgICogICAgIC0gYCRzY29wZWAgLSBUaGUgY3VycmVudCByb3V0ZSBzY29wZS5cbiAgICAgKiAgICAgLSBgJHRlbXBsYXRlYCAtIFRoZSBjdXJyZW50IHJvdXRlIHRlbXBsYXRlIEhUTUwuXG4gICAgICpcbiAgICAgKiAgICAgVGhlIGBsb2NhbHNgIHdpbGwgYmUgYXNzaWduZWQgdG8gdGhlIHJvdXRlIHNjb3BlJ3MgYCRyZXNvbHZlYCBwcm9wZXJ0eS4gWW91IGNhbiBvdmVycmlkZVxuICAgICAqICAgICB0aGUgcHJvcGVydHkgbmFtZSwgdXNpbmcgYHJlc29sdmVBc2AgaW4gdGhlIHJvdXRlIGRlZmluaXRpb24uIFNlZVxuICAgICAqICAgICB7QGxpbmsgbmdSb3V0ZS4kcm91dGVQcm92aWRlciAkcm91dGVQcm92aWRlcn0gZm9yIG1vcmUgaW5mby5cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSByb3V0ZXMgT2JqZWN0IHdpdGggYWxsIHJvdXRlIGNvbmZpZ3VyYXRpb24gT2JqZWN0cyBhcyBpdHMgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIGAkcm91dGVgIGlzIHVzZWQgZm9yIGRlZXAtbGlua2luZyBVUkxzIHRvIGNvbnRyb2xsZXJzIGFuZCB2aWV3cyAoSFRNTCBwYXJ0aWFscykuXG4gICAgICogSXQgd2F0Y2hlcyBgJGxvY2F0aW9uLnVybCgpYCBhbmQgdHJpZXMgdG8gbWFwIHRoZSBwYXRoIHRvIGFuIGV4aXN0aW5nIHJvdXRlIGRlZmluaXRpb24uXG4gICAgICpcbiAgICAgKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICAgICAqXG4gICAgICogWW91IGNhbiBkZWZpbmUgcm91dGVzIHRocm91Z2gge0BsaW5rIG5nUm91dGUuJHJvdXRlUHJvdmlkZXIgJHJvdXRlUHJvdmlkZXJ9J3MgQVBJLlxuICAgICAqXG4gICAgICogVGhlIGAkcm91dGVgIHNlcnZpY2UgaXMgdHlwaWNhbGx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IGBuZ1ZpZXdgfSBkaXJlY3RpdmUgYW5kIHRoZVxuICAgICAqIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVBhcmFtcyBgJHJvdXRlUGFyYW1zYH0gc2VydmljZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogVGhpcyBleGFtcGxlIHNob3dzIGhvdyBjaGFuZ2luZyB0aGUgVVJMIGhhc2ggY2F1c2VzIHRoZSBgJHJvdXRlYCB0byBtYXRjaCBhIHJvdXRlIGFnYWluc3QgdGhlXG4gICAgICogVVJMLCBhbmQgdGhlIGBuZ1ZpZXdgIHB1bGxzIGluIHRoZSBwYXJ0aWFsLlxuICAgICAqXG4gICAgICogPGV4YW1wbGUgbmFtZT1cIiRyb3V0ZS1zZXJ2aWNlXCIgbW9kdWxlPVwibmdSb3V0ZUV4YW1wbGVcIlxuICAgICAqICAgICAgICAgIGRlcHM9XCJhbmd1bGFyLXJvdXRlLmpzXCIgZml4QmFzZT1cInRydWVcIj5cbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJpbmRleC5odG1sXCI+XG4gICAgICogICAgIDxkaXYgbmctY29udHJvbGxlcj1cIk1haW5Db250cm9sbGVyXCI+XG4gICAgICogICAgICAgQ2hvb3NlOlxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnlcIj5Nb2J5PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieS9jaC8xXCI+TW9ieTogQ2gxPC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5XCI+R2F0c2J5PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5L2NoLzQ/a2V5PXZhbHVlXCI+R2F0c2J5OiBDaDQ8L2E+IHxcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9TY2FybGV0XCI+U2NhcmxldCBMZXR0ZXI8L2E+PGJyLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxkaXYgbmctdmlldz48L2Rpdj5cbiAgICAgKlxuICAgICAqICAgICAgIDxociAvPlxuICAgICAqXG4gICAgICogICAgICAgPHByZT4kbG9jYXRpb24ucGF0aCgpID0ge3skbG9jYXRpb24ucGF0aCgpfX08L3ByZT5cbiAgICAgKiAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsID0ge3skcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybH19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC5wYXJhbXMgPSB7eyRyb3V0ZS5jdXJyZW50LnBhcmFtc319PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC5zY29wZS5uYW1lID0ge3skcm91dGUuY3VycmVudC5zY29wZS5uYW1lfX08L3ByZT5cbiAgICAgKiAgICAgICA8cHJlPiRyb3V0ZVBhcmFtcyA9IHt7JHJvdXRlUGFyYW1zfX08L3ByZT5cbiAgICAgKiAgICAgPC9kaXY+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJib29rLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cImNoYXB0ZXIuaHRtbFwiPlxuICAgICAqICAgICBjb250cm9sbGVyOiB7e25hbWV9fTxiciAvPlxuICAgICAqICAgICBCb29rIElkOiB7e3BhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAqICAgICBDaGFwdGVyIElkOiB7e3BhcmFtcy5jaGFwdGVySWR9fVxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwic2NyaXB0LmpzXCI+XG4gICAgICogICAgIGFuZ3VsYXIubW9kdWxlKCduZ1JvdXRlRXhhbXBsZScsIFsnbmdSb3V0ZSddKVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJHJvdXRlID0gJHJvdXRlO1xuICAgICAqICAgICAgICAgICRzY29wZS4kbG9jYXRpb24gPSAkbG9jYXRpb247XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZVBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgIC5jb250cm9sbGVyKCdCb29rQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLm5hbWUgPSBcIkJvb2tDb250cm9sbGVyXCI7XG4gICAgICogICAgICAgICAgJHNjb3BlLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgIC5jb250cm9sbGVyKCdDaGFwdGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLm5hbWUgPSBcIkNoYXB0ZXJDb250cm9sbGVyXCI7XG4gICAgICogICAgICAgICAgJHNjb3BlLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgKiAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAqICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZCcsIHtcbiAgICAgKiAgICAgICAgIHRlbXBsYXRlVXJsOiAnYm9vay5odG1sJyxcbiAgICAgKiAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQ29udHJvbGxlcicsXG4gICAgICogICAgICAgICByZXNvbHZlOiB7XG4gICAgICogICAgICAgICAgIC8vIEkgd2lsbCBjYXVzZSBhIDEgc2Vjb25kIGRlbGF5XG4gICAgICogICAgICAgICAgIGRlbGF5OiBmdW5jdGlvbigkcSwgJHRpbWVvdXQpIHtcbiAgICAgKiAgICAgICAgICAgICB2YXIgZGVsYXkgPSAkcS5kZWZlcigpO1xuICAgICAqICAgICAgICAgICAgICR0aW1lb3V0KGRlbGF5LnJlc29sdmUsIDEwMDApO1xuICAgICAqICAgICAgICAgICAgIHJldHVybiBkZWxheS5wcm9taXNlO1xuICAgICAqICAgICAgICAgICB9XG4gICAgICogICAgICAgICB9XG4gICAgICogICAgICAgfSlcbiAgICAgKiAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZC9jaC86Y2hhcHRlcklkJywge1xuICAgICAqICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGFwdGVyLmh0bWwnLFxuICAgICAqICAgICAgICAgY29udHJvbGxlcjogJ0NoYXB0ZXJDb250cm9sbGVyJ1xuICAgICAqICAgICAgIH0pO1xuICAgICAqXG4gICAgICogICAgICAgLy8gY29uZmlndXJlIGh0bWw1IHRvIGdldCBsaW5rcyB3b3JraW5nIG9uIGpzZmlkZGxlXG4gICAgICogICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAqICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwicHJvdHJhY3Rvci5qc1wiIHR5cGU9XCJwcm90cmFjdG9yXCI+XG4gICAgICogICAgIGl0KCdzaG91bGQgbG9hZCBhbmQgY29tcGlsZSBjb3JyZWN0IHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgZWxlbWVudChieS5saW5rVGV4dCgnTW9ieTogQ2gxJykpLmNsaWNrKCk7XG4gICAgICogICAgICAgdmFyIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBDaGFwdGVyQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IE1vYnkvKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQ2hhcHRlciBJZFxcOiAxLyk7XG4gICAgICpcbiAgICAgKiAgICAgICBlbGVtZW50KGJ5LnBhcnRpYWxMaW5rVGV4dCgnU2NhcmxldCcpKS5jbGljaygpO1xuICAgICAqXG4gICAgICogICAgICAgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyXFw6IEJvb2tDb250cm9sbGVyLyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWRcXDogU2NhcmxldC8pO1xuICAgICAqICAgICB9KTtcbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKiA8L2V4YW1wbGU+XG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlU3RhcnRcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgYmVmb3JlIGEgcm91dGUgY2hhbmdlLiBBdCB0aGlzICBwb2ludCB0aGUgcm91dGUgc2VydmljZXMgc3RhcnRzXG4gICAgICogcmVzb2x2aW5nIGFsbCBvZiB0aGUgZGVwZW5kZW5jaWVzIG5lZWRlZCBmb3IgdGhlIHJvdXRlIGNoYW5nZSB0byBvY2N1ci5cbiAgICAgKiBUeXBpY2FsbHkgdGhpcyBpbnZvbHZlcyBmZXRjaGluZyB0aGUgdmlldyB0ZW1wbGF0ZSBhcyB3ZWxsIGFzIGFueSBkZXBlbmRlbmNpZXNcbiAgICAgKiBkZWZpbmVkIGluIGByZXNvbHZlYCByb3V0ZSBwcm9wZXJ0eS4gT25jZSAgYWxsIG9mIHRoZSBkZXBlbmRlbmNpZXMgYXJlIHJlc29sdmVkXG4gICAgICogYCRyb3V0ZUNoYW5nZVN1Y2Nlc3NgIGlzIGZpcmVkLlxuICAgICAqXG4gICAgICogVGhlIHJvdXRlIGNoYW5nZSAoYW5kIHRoZSBgJGxvY2F0aW9uYCBjaGFuZ2UgdGhhdCB0cmlnZ2VyZWQgaXQpIGNhbiBiZSBwcmV2ZW50ZWRcbiAgICAgKiBieSBjYWxsaW5nIGBwcmV2ZW50RGVmYXVsdGAgbWV0aG9kIG9mIHRoZSBldmVudC4gU2VlIHtAbGluayBuZy4kcm9vdFNjb3BlLlNjb3BlIyRvbn1cbiAgICAgKiBmb3IgbW9yZSBkZXRhaWxzIGFib3V0IGV2ZW50IG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBuZXh0IEZ1dHVyZSByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlU3VjY2Vzc1xuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBCcm9hZGNhc3RlZCBhZnRlciBhIHJvdXRlIGNoYW5nZSBoYXMgaGFwcGVuZWQgc3VjY2Vzc2Z1bGx5LlxuICAgICAqIFRoZSBgcmVzb2x2ZWAgZGVwZW5kZW5jaWVzIGFyZSBub3cgYXZhaWxhYmxlIGluIHRoZSBgY3VycmVudC5sb2NhbHNgIHByb3BlcnR5LlxuICAgICAqXG4gICAgICoge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9IGxpc3RlbnMgZm9yIHRoZSBkaXJlY3RpdmVcbiAgICAgKiB0byBpbnN0YW50aWF0ZSB0aGUgY29udHJvbGxlciBhbmQgcmVuZGVyIHRoZSB2aWV3LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfFVuZGVmaW5lZH0gcHJldmlvdXMgUHJldmlvdXMgcm91dGUgaW5mb3JtYXRpb24sIG9yIHVuZGVmaW5lZCBpZiBjdXJyZW50IGlzXG4gICAgICogZmlyc3Qgcm91dGUgZW50ZXJlZC5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVDaGFuZ2VFcnJvclxuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBCcm9hZGNhc3RlZCBpZiBhbnkgb2YgdGhlIHJlc29sdmUgcHJvbWlzZXMgYXJlIHJlamVjdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0XG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV9IHByZXZpb3VzIFByZXZpb3VzIHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV9IHJlamVjdGlvbiBSZWplY3Rpb24gb2YgdGhlIHByb21pc2UuIFVzdWFsbHkgdGhlIGVycm9yIG9mIHRoZSBmYWlsZWQgcHJvbWlzZS5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVVcGRhdGVcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhlIGByZWxvYWRPblNlYXJjaGAgcHJvcGVydHkgaGFzIGJlZW4gc2V0IHRvIGZhbHNlLCBhbmQgd2UgYXJlIHJldXNpbmcgdGhlIHNhbWVcbiAgICAgKiBpbnN0YW5jZSBvZiB0aGUgQ29udHJvbGxlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdFxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudC9wcmV2aW91cyByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKi9cblxuICAgIHZhciBmb3JjZVJlbG9hZCA9IGZhbHNlLFxuICAgICAgICBwcmVwYXJlZFJvdXRlLFxuICAgICAgICBwcmVwYXJlZFJvdXRlSXNVcGRhdGVPbmx5LFxuICAgICAgICAkcm91dGUgPSB7XG4gICAgICAgICAgcm91dGVzOiByb3V0ZXMsXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICogQG5hbWUgJHJvdXRlI3JlbG9hZFxuICAgICAgICAgICAqXG4gICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICogQ2F1c2VzIGAkcm91dGVgIHNlcnZpY2UgdG8gcmVsb2FkIHRoZSBjdXJyZW50IHJvdXRlIGV2ZW4gaWZcbiAgICAgICAgICAgKiB7QGxpbmsgbmcuJGxvY2F0aW9uICRsb2NhdGlvbn0gaGFzbid0IGNoYW5nZWQuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBBcyBhIHJlc3VsdCBvZiB0aGF0LCB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld31cbiAgICAgICAgICAgKiBjcmVhdGVzIG5ldyBzY29wZSBhbmQgcmVpbnN0YW50aWF0ZXMgdGhlIGNvbnRyb2xsZXIuXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmVsb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvcmNlUmVsb2FkID0gdHJ1ZTtcblxuICAgICAgICAgICAgdmFyIGZha2VMb2NhdGlvbkV2ZW50ID0ge1xuICAgICAgICAgICAgICBkZWZhdWx0UHJldmVudGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uIGZha2VQcmV2ZW50RGVmYXVsdCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcmNlUmVsb2FkID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRyb290U2NvcGUuJGV2YWxBc3luYyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcHJlcGFyZVJvdXRlKGZha2VMb2NhdGlvbkV2ZW50KTtcbiAgICAgICAgICAgICAgaWYgKCFmYWtlTG9jYXRpb25FdmVudC5kZWZhdWx0UHJldmVudGVkKSBjb21taXRSb3V0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgKiBAbmFtZSAkcm91dGUjdXBkYXRlUGFyYW1zXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgKiBDYXVzZXMgYCRyb3V0ZWAgc2VydmljZSB0byB1cGRhdGUgdGhlIGN1cnJlbnQgVVJMLCByZXBsYWNpbmdcbiAgICAgICAgICAgKiBjdXJyZW50IHJvdXRlIHBhcmFtZXRlcnMgd2l0aCB0aG9zZSBzcGVjaWZpZWQgaW4gYG5ld1BhcmFtc2AuXG4gICAgICAgICAgICogUHJvdmlkZWQgcHJvcGVydHkgbmFtZXMgdGhhdCBtYXRjaCB0aGUgcm91dGUncyBwYXRoIHNlZ21lbnRcbiAgICAgICAgICAgKiBkZWZpbml0aW9ucyB3aWxsIGJlIGludGVycG9sYXRlZCBpbnRvIHRoZSBsb2NhdGlvbidzIHBhdGgsIHdoaWxlXG4gICAgICAgICAgICogcmVtYWluaW5nIHByb3BlcnRpZXMgd2lsbCBiZSB0cmVhdGVkIGFzIHF1ZXJ5IHBhcmFtcy5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEBwYXJhbSB7IU9iamVjdDxzdHJpbmcsIHN0cmluZz59IG5ld1BhcmFtcyBtYXBwaW5nIG9mIFVSTCBwYXJhbWV0ZXIgbmFtZXMgdG8gdmFsdWVzXG4gICAgICAgICAgICovXG4gICAgICAgICAgdXBkYXRlUGFyYW1zOiBmdW5jdGlvbihuZXdQYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQgJiYgdGhpcy5jdXJyZW50LiQkcm91dGUpIHtcbiAgICAgICAgICAgICAgbmV3UGFyYW1zID0gYW5ndWxhci5leHRlbmQoe30sIHRoaXMuY3VycmVudC5wYXJhbXMsIG5ld1BhcmFtcyk7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKGludGVycG9sYXRlKHRoaXMuY3VycmVudC4kJHJvdXRlLm9yaWdpbmFsUGF0aCwgbmV3UGFyYW1zKSk7XG4gICAgICAgICAgICAgIC8vIGludGVycG9sYXRlIG1vZGlmaWVzIG5ld1BhcmFtcywgb25seSBxdWVyeSBwYXJhbXMgYXJlIGxlZnRcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaChuZXdQYXJhbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgJHJvdXRlTWluRXJyKCdub3JvdXQnLCAnVHJpZWQgdXBkYXRpbmcgcm91dGUgd2hlbiB3aXRoIG5vIGN1cnJlbnQgcm91dGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBwcmVwYXJlUm91dGUpO1xuICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgY29tbWl0Um91dGUpO1xuXG4gICAgcmV0dXJuICRyb3V0ZTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb24ge3N0cmluZ30gY3VycmVudCB1cmxcbiAgICAgKiBAcGFyYW0gcm91dGUge09iamVjdH0gcm91dGUgcmVnZXhwIHRvIG1hdGNoIHRoZSB1cmwgYWdhaW5zdFxuICAgICAqIEByZXR1cm4gez9PYmplY3R9XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBDaGVjayBpZiB0aGUgcm91dGUgbWF0Y2hlcyB0aGUgY3VycmVudCB1cmwuXG4gICAgICpcbiAgICAgKiBJbnNwaXJlZCBieSBtYXRjaCBpblxuICAgICAqIHZpc2lvbm1lZGlhL2V4cHJlc3MvbGliL3JvdXRlci9yb3V0ZXIuanMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3dpdGNoUm91dGVNYXRjaGVyKG9uLCByb3V0ZSkge1xuICAgICAgdmFyIGtleXMgPSByb3V0ZS5rZXlzLFxuICAgICAgICAgIHBhcmFtcyA9IHt9O1xuXG4gICAgICBpZiAoIXJvdXRlLnJlZ2V4cCkgcmV0dXJuIG51bGw7XG5cbiAgICAgIHZhciBtID0gcm91dGUucmVnZXhwLmV4ZWMob24pO1xuICAgICAgaWYgKCFtKSByZXR1cm4gbnVsbDtcblxuICAgICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbaSAtIDFdO1xuXG4gICAgICAgIHZhciB2YWwgPSBtW2ldO1xuXG4gICAgICAgIGlmIChrZXkgJiYgdmFsKSB7XG4gICAgICAgICAgcGFyYW1zW2tleS5uYW1lXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVwYXJlUm91dGUoJGxvY2F0aW9uRXZlbnQpIHtcbiAgICAgIHZhciBsYXN0Um91dGUgPSAkcm91dGUuY3VycmVudDtcblxuICAgICAgcHJlcGFyZWRSb3V0ZSA9IHBhcnNlUm91dGUoKTtcbiAgICAgIHByZXBhcmVkUm91dGVJc1VwZGF0ZU9ubHkgPSBwcmVwYXJlZFJvdXRlICYmIGxhc3RSb3V0ZSAmJiBwcmVwYXJlZFJvdXRlLiQkcm91dGUgPT09IGxhc3RSb3V0ZS4kJHJvdXRlXG4gICAgICAgICAgJiYgYW5ndWxhci5lcXVhbHMocHJlcGFyZWRSb3V0ZS5wYXRoUGFyYW1zLCBsYXN0Um91dGUucGF0aFBhcmFtcylcbiAgICAgICAgICAmJiAhcHJlcGFyZWRSb3V0ZS5yZWxvYWRPblNlYXJjaCAmJiAhZm9yY2VSZWxvYWQ7XG5cbiAgICAgIGlmICghcHJlcGFyZWRSb3V0ZUlzVXBkYXRlT25seSAmJiAobGFzdFJvdXRlIHx8IHByZXBhcmVkUm91dGUpKSB7XG4gICAgICAgIGlmICgkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN0YXJ0JywgcHJlcGFyZWRSb3V0ZSwgbGFzdFJvdXRlKS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgaWYgKCRsb2NhdGlvbkV2ZW50KSB7XG4gICAgICAgICAgICAkbG9jYXRpb25FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbW1pdFJvdXRlKCkge1xuICAgICAgdmFyIGxhc3RSb3V0ZSA9ICRyb3V0ZS5jdXJyZW50O1xuICAgICAgdmFyIG5leHRSb3V0ZSA9IHByZXBhcmVkUm91dGU7XG5cbiAgICAgIGlmIChwcmVwYXJlZFJvdXRlSXNVcGRhdGVPbmx5KSB7XG4gICAgICAgIGxhc3RSb3V0ZS5wYXJhbXMgPSBuZXh0Um91dGUucGFyYW1zO1xuICAgICAgICBhbmd1bGFyLmNvcHkobGFzdFJvdXRlLnBhcmFtcywgJHJvdXRlUGFyYW1zKTtcbiAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVVcGRhdGUnLCBsYXN0Um91dGUpO1xuICAgICAgfSBlbHNlIGlmIChuZXh0Um91dGUgfHwgbGFzdFJvdXRlKSB7XG4gICAgICAgIGZvcmNlUmVsb2FkID0gZmFsc2U7XG4gICAgICAgICRyb3V0ZS5jdXJyZW50ID0gbmV4dFJvdXRlO1xuICAgICAgICBpZiAobmV4dFJvdXRlKSB7XG4gICAgICAgICAgaWYgKG5leHRSb3V0ZS5yZWRpcmVjdFRvKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhuZXh0Um91dGUucmVkaXJlY3RUbykpIHtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoaW50ZXJwb2xhdGUobmV4dFJvdXRlLnJlZGlyZWN0VG8sIG5leHRSb3V0ZS5wYXJhbXMpKS5zZWFyY2gobmV4dFJvdXRlLnBhcmFtcylcbiAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi51cmwobmV4dFJvdXRlLnJlZGlyZWN0VG8obmV4dFJvdXRlLnBhdGhQYXJhbXMsICRsb2NhdGlvbi5wYXRoKCksICRsb2NhdGlvbi5zZWFyY2goKSkpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHEud2hlbihuZXh0Um91dGUpLlxuICAgICAgICAgIHRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAobmV4dFJvdXRlKSB7XG4gICAgICAgICAgICAgIHZhciBsb2NhbHMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgbmV4dFJvdXRlLnJlc29sdmUpLFxuICAgICAgICAgICAgICAgICAgdGVtcGxhdGUsIHRlbXBsYXRlVXJsO1xuXG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsb2NhbHMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbHNba2V5XSA9IGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpID9cbiAgICAgICAgICAgICAgICAgICAgJGluamVjdG9yLmdldCh2YWx1ZSkgOiAkaW5qZWN0b3IuaW52b2tlKHZhbHVlLCBudWxsLCBudWxsLCBrZXkpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUgPSBuZXh0Um91dGUudGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbih0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUobmV4dFJvdXRlLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlVXJsID0gbmV4dFJvdXRlLnRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odGVtcGxhdGVVcmwpKSB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA9IHRlbXBsYXRlVXJsKG5leHRSb3V0ZS5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGVVcmwpKSB7XG4gICAgICAgICAgICAgICAgICBuZXh0Um91dGUubG9hZGVkVGVtcGxhdGVVcmwgPSAkc2NlLnZhbHVlT2YodGVtcGxhdGVVcmwpO1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSAkdGVtcGxhdGVSZXF1ZXN0KHRlbXBsYXRlVXJsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgIGxvY2Fsc1snJHRlbXBsYXRlJ10gPSB0ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKGxvY2Fscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuXG4gICAgICAgICAgdGhlbihmdW5jdGlvbihsb2NhbHMpIHtcbiAgICAgICAgICAgIC8vIGFmdGVyIHJvdXRlIGNoYW5nZVxuICAgICAgICAgICAgaWYgKG5leHRSb3V0ZSA9PSAkcm91dGUuY3VycmVudCkge1xuICAgICAgICAgICAgICBpZiAobmV4dFJvdXRlKSB7XG4gICAgICAgICAgICAgICAgbmV4dFJvdXRlLmxvY2FscyA9IGxvY2FscztcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkobmV4dFJvdXRlLnBhcmFtcywgJHJvdXRlUGFyYW1zKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBuZXh0Um91dGUsIGxhc3RSb3V0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChuZXh0Um91dGUgPT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VFcnJvcicsIG5leHRSb3V0ZSwgbGFzdFJvdXRlLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgY3VycmVudCBhY3RpdmUgcm91dGUsIGJ5IG1hdGNoaW5nIGl0IGFnYWluc3QgdGhlIFVSTFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlUm91dGUoKSB7XG4gICAgICAvLyBNYXRjaCBhIHJvdXRlXG4gICAgICB2YXIgcGFyYW1zLCBtYXRjaDtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3V0ZXMsIGZ1bmN0aW9uKHJvdXRlLCBwYXRoKSB7XG4gICAgICAgIGlmICghbWF0Y2ggJiYgKHBhcmFtcyA9IHN3aXRjaFJvdXRlTWF0Y2hlcigkbG9jYXRpb24ucGF0aCgpLCByb3V0ZSkpKSB7XG4gICAgICAgICAgbWF0Y2ggPSBpbmhlcml0KHJvdXRlLCB7XG4gICAgICAgICAgICBwYXJhbXM6IGFuZ3VsYXIuZXh0ZW5kKHt9LCAkbG9jYXRpb24uc2VhcmNoKCksIHBhcmFtcyksXG4gICAgICAgICAgICBwYXRoUGFyYW1zOiBwYXJhbXN9KTtcbiAgICAgICAgICBtYXRjaC4kJHJvdXRlID0gcm91dGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gTm8gcm91dGUgbWF0Y2hlZDsgZmFsbGJhY2sgdG8gXCJvdGhlcndpc2VcIiByb3V0ZVxuICAgICAgcmV0dXJuIG1hdGNoIHx8IHJvdXRlc1tudWxsXSAmJiBpbmhlcml0KHJvdXRlc1tudWxsXSwge3BhcmFtczoge30sIHBhdGhQYXJhbXM6e319KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBpbnRlcnBvbGF0aW9uIG9mIHRoZSByZWRpcmVjdCBwYXRoIHdpdGggdGhlIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShzdHJpbmcsIHBhcmFtcykge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKChzdHJpbmcgfHwgJycpLnNwbGl0KCc6JyksIGZ1bmN0aW9uKHNlZ21lbnQsIGkpIHtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2VnbWVudE1hdGNoID0gc2VnbWVudC5tYXRjaCgvKFxcdyspKD86Wz8qXSk/KC4qKS8pO1xuICAgICAgICAgIHZhciBrZXkgPSBzZWdtZW50TWF0Y2hbMV07XG4gICAgICAgICAgcmVzdWx0LnB1c2gocGFyYW1zW2tleV0pO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnRNYXRjaFsyXSB8fCAnJyk7XG4gICAgICAgICAgZGVsZXRlIHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgfVxuICB9XTtcbn1cblxubmdSb3V0ZU1vZHVsZS5wcm92aWRlcignJHJvdXRlUGFyYW1zJywgJFJvdXRlUGFyYW1zUHJvdmlkZXIpO1xuXG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lICRyb3V0ZVBhcmFtc1xuICogQHJlcXVpcmVzICRyb3V0ZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGAkcm91dGVQYXJhbXNgIHNlcnZpY2UgYWxsb3dzIHlvdSB0byByZXRyaWV2ZSB0aGUgY3VycmVudCBzZXQgb2Ygcm91dGUgcGFyYW1ldGVycy5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIFRoZSByb3V0ZSBwYXJhbWV0ZXJzIGFyZSBhIGNvbWJpbmF0aW9uIG9mIHtAbGluayBuZy4kbG9jYXRpb24gYCRsb2NhdGlvbmB9J3NcbiAqIHtAbGluayBuZy4kbG9jYXRpb24jc2VhcmNoIGBzZWFyY2goKWB9IGFuZCB7QGxpbmsgbmcuJGxvY2F0aW9uI3BhdGggYHBhdGgoKWB9LlxuICogVGhlIGBwYXRoYCBwYXJhbWV0ZXJzIGFyZSBleHRyYWN0ZWQgd2hlbiB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlIGAkcm91dGVgfSBwYXRoIGlzIG1hdGNoZWQuXG4gKlxuICogSW4gY2FzZSBvZiBwYXJhbWV0ZXIgbmFtZSBjb2xsaXNpb24sIGBwYXRoYCBwYXJhbXMgdGFrZSBwcmVjZWRlbmNlIG92ZXIgYHNlYXJjaGAgcGFyYW1zLlxuICpcbiAqIFRoZSBzZXJ2aWNlIGd1YXJhbnRlZXMgdGhhdCB0aGUgaWRlbnRpdHkgb2YgdGhlIGAkcm91dGVQYXJhbXNgIG9iamVjdCB3aWxsIHJlbWFpbiB1bmNoYW5nZWRcbiAqIChidXQgaXRzIHByb3BlcnRpZXMgd2lsbCBsaWtlbHkgY2hhbmdlKSBldmVuIHdoZW4gYSByb3V0ZSBjaGFuZ2Ugb2NjdXJzLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgYCRyb3V0ZVBhcmFtc2AgYXJlIG9ubHkgdXBkYXRlZCAqYWZ0ZXIqIGEgcm91dGUgY2hhbmdlIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gKiBUaGlzIG1lYW5zIHRoYXQgeW91IGNhbm5vdCByZWx5IG9uIGAkcm91dGVQYXJhbXNgIGJlaW5nIGNvcnJlY3QgaW4gcm91dGUgcmVzb2x2ZSBmdW5jdGlvbnMuXG4gKiBJbnN0ZWFkIHlvdSBjYW4gdXNlIGAkcm91dGUuY3VycmVudC5wYXJhbXNgIHRvIGFjY2VzcyB0aGUgbmV3IHJvdXRlJ3MgcGFyYW1ldGVycy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqICAvLyBHaXZlbjpcbiAqICAvLyBVUkw6IGh0dHA6Ly9zZXJ2ZXIuY29tL2luZGV4Lmh0bWwjL0NoYXB0ZXIvMS9TZWN0aW9uLzI/c2VhcmNoPW1vYnlcbiAqICAvLyBSb3V0ZTogL0NoYXB0ZXIvOmNoYXB0ZXJJZC9TZWN0aW9uLzpzZWN0aW9uSWRcbiAqICAvL1xuICogIC8vIFRoZW5cbiAqICAkcm91dGVQYXJhbXMgPT0+IHtjaGFwdGVySWQ6JzEnLCBzZWN0aW9uSWQ6JzInLCBzZWFyY2g6J21vYnknfVxuICogYGBgXG4gKi9cbmZ1bmN0aW9uICRSb3V0ZVBhcmFtc1Byb3ZpZGVyKCkge1xuICB0aGlzLiRnZXQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHt9OyB9O1xufVxuXG5uZ1JvdXRlTW9kdWxlLmRpcmVjdGl2ZSgnbmdWaWV3JywgbmdWaWV3RmFjdG9yeSk7XG5uZ1JvdXRlTW9kdWxlLmRpcmVjdGl2ZSgnbmdWaWV3JywgbmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5KTtcblxuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIG5nVmlld1xuICogQHJlc3RyaWN0IEVDQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogIyBPdmVydmlld1xuICogYG5nVmlld2AgaXMgYSBkaXJlY3RpdmUgdGhhdCBjb21wbGVtZW50cyB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlICRyb3V0ZX0gc2VydmljZSBieVxuICogaW5jbHVkaW5nIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZSBvZiB0aGUgY3VycmVudCByb3V0ZSBpbnRvIHRoZSBtYWluIGxheW91dCAoYGluZGV4Lmh0bWxgKSBmaWxlLlxuICogRXZlcnkgdGltZSB0aGUgY3VycmVudCByb3V0ZSBjaGFuZ2VzLCB0aGUgaW5jbHVkZWQgdmlldyBjaGFuZ2VzIHdpdGggaXQgYWNjb3JkaW5nIHRvIHRoZVxuICogY29uZmlndXJhdGlvbiBvZiB0aGUgYCRyb3V0ZWAgc2VydmljZS5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIEBhbmltYXRpb25zXG4gKiB8IEFuaW1hdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIHwgT2NjdXJzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcbiAqIHwge0BsaW5rIG5nLiRhbmltYXRlI2VudGVyIGVudGVyfSAgfCB3aGVuIHRoZSBuZXcgZWxlbWVudCBpcyBpbnNlcnRlZCB0byB0aGUgRE9NIHxcbiAqIHwge0BsaW5rIG5nLiRhbmltYXRlI2xlYXZlIGxlYXZlfSAgfCB3aGVuIHRoZSBvbGQgZWxlbWVudCBpcyByZW1vdmVkIGZyb20gdG8gdGhlIERPTSAgfFxuICpcbiAqIFRoZSBlbnRlciBhbmQgbGVhdmUgYW5pbWF0aW9uIG9jY3VyIGNvbmN1cnJlbnRseS5cbiAqXG4gKiBAa25vd25Jc3N1ZSBJZiBgbmdWaWV3YCBpcyBjb250YWluZWQgaW4gYW4gYXN5bmNocm9ub3VzbHkgbG9hZGVkIHRlbXBsYXRlIChlLmcuIGluIGFub3RoZXJcbiAqICAgICAgICAgICAgIGRpcmVjdGl2ZSdzIHRlbXBsYXRlVXJsIG9yIGluIGEgdGVtcGxhdGUgbG9hZGVkIHVzaW5nIGBuZ0luY2x1ZGVgKSwgdGhlbiB5b3UgbmVlZCB0b1xuICogICAgICAgICAgICAgbWFrZSBzdXJlIHRoYXQgYCRyb3V0ZWAgaXMgaW5zdGFudGlhdGVkIGluIHRpbWUgdG8gY2FwdHVyZSB0aGUgaW5pdGlhbFxuICogICAgICAgICAgICAgYCRsb2NhdGlvbkNoYW5nZVN0YXJ0YCBldmVudCBhbmQgbG9hZCB0aGUgYXBwcm9wcmlhdGUgdmlldy4gT25lIHdheSB0byBhY2hpZXZlIHRoaXNcbiAqICAgICAgICAgICAgIGlzIHRvIGhhdmUgaXQgYXMgYSBkZXBlbmRlbmN5IGluIGEgYC5ydW5gIGJsb2NrOlxuICogICAgICAgICAgICAgYG15TW9kdWxlLnJ1bihbJyRyb3V0ZScsIGZ1bmN0aW9uKCkge31dKTtgXG4gKlxuICogQHNjb3BlXG4gKiBAcHJpb3JpdHkgNDAwXG4gKiBAcGFyYW0ge3N0cmluZz19IG9ubG9hZCBFeHByZXNzaW9uIHRvIGV2YWx1YXRlIHdoZW5ldmVyIHRoZSB2aWV3IHVwZGF0ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmc9fSBhdXRvc2Nyb2xsIFdoZXRoZXIgYG5nVmlld2Agc2hvdWxkIGNhbGwge0BsaW5rIG5nLiRhbmNob3JTY3JvbGxcbiAqICAgICAgICAgICAgICAgICAgJGFuY2hvclNjcm9sbH0gdG8gc2Nyb2xsIHRoZSB2aWV3cG9ydCBhZnRlciB0aGUgdmlldyBpcyB1cGRhdGVkLlxuICpcbiAqICAgICAgICAgICAgICAgICAgLSBJZiB0aGUgYXR0cmlidXRlIGlzIG5vdCBzZXQsIGRpc2FibGUgc2Nyb2xsaW5nLlxuICogICAgICAgICAgICAgICAgICAtIElmIHRoZSBhdHRyaWJ1dGUgaXMgc2V0IHdpdGhvdXQgdmFsdWUsIGVuYWJsZSBzY3JvbGxpbmcuXG4gKiAgICAgICAgICAgICAgICAgIC0gT3RoZXJ3aXNlIGVuYWJsZSBzY3JvbGxpbmcgb25seSBpZiB0aGUgYGF1dG9zY3JvbGxgIGF0dHJpYnV0ZSB2YWx1ZSBldmFsdWF0ZWRcbiAqICAgICAgICAgICAgICAgICAgICBhcyBhbiBleHByZXNzaW9uIHlpZWxkcyBhIHRydXRoeSB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gICAgPGV4YW1wbGUgbmFtZT1cIm5nVmlldy1kaXJlY3RpdmVcIiBtb2R1bGU9XCJuZ1ZpZXdFeGFtcGxlXCJcbiAgICAgICAgICAgICBkZXBzPVwiYW5ndWxhci1yb3V0ZS5qczthbmd1bGFyLWFuaW1hdGUuanNcIlxuICAgICAgICAgICAgIGFuaW1hdGlvbnM9XCJ0cnVlXCIgZml4QmFzZT1cInRydWVcIj5cbiAgICAgIDxmaWxlIG5hbWU9XCJpbmRleC5odG1sXCI+XG4gICAgICAgIDxkaXYgbmctY29udHJvbGxlcj1cIk1haW5DdHJsIGFzIG1haW5cIj5cbiAgICAgICAgICBDaG9vc2U6XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieVwiPk1vYnk8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5L2NoLzFcIj5Nb2J5OiBDaDE8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9HYXRzYnlcIj5HYXRzYnk8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9HYXRzYnkvY2gvND9rZXk9dmFsdWVcIj5HYXRzYnk6IENoNDwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL1NjYXJsZXRcIj5TY2FybGV0IExldHRlcjwvYT48YnIvPlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZpZXctYW5pbWF0ZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgbmctdmlldyBjbGFzcz1cInZpZXctYW5pbWF0ZVwiPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxociAvPlxuXG4gICAgICAgICAgPHByZT4kbG9jYXRpb24ucGF0aCgpID0ge3ttYWluLiRsb2NhdGlvbi5wYXRoKCl9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmwgPSB7e21haW4uJHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmx9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQucGFyYW1zID0ge3ttYWluLiRyb3V0ZS5jdXJyZW50LnBhcmFtc319PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGVQYXJhbXMgPSB7e21haW4uJHJvdXRlUGFyYW1zfX08L3ByZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJib29rLmh0bWxcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBjb250cm9sbGVyOiB7e2Jvb2submFtZX19PGJyIC8+XG4gICAgICAgICAgQm9vayBJZDoge3tib29rLnBhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cImNoYXB0ZXIuaHRtbFwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIGNvbnRyb2xsZXI6IHt7Y2hhcHRlci5uYW1lfX08YnIgLz5cbiAgICAgICAgICBCb29rIElkOiB7e2NoYXB0ZXIucGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICAgICAgQ2hhcHRlciBJZDoge3tjaGFwdGVyLnBhcmFtcy5jaGFwdGVySWR9fVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cImFuaW1hdGlvbnMuY3NzXCI+XG4gICAgICAgIC52aWV3LWFuaW1hdGUtY29udGFpbmVyIHtcbiAgICAgICAgICBwb3NpdGlvbjpyZWxhdGl2ZTtcbiAgICAgICAgICBoZWlnaHQ6MTAwcHghaW1wb3J0YW50O1xuICAgICAgICAgIGJhY2tncm91bmQ6d2hpdGU7XG4gICAgICAgICAgYm9yZGVyOjFweCBzb2xpZCBibGFjaztcbiAgICAgICAgICBoZWlnaHQ6NDBweDtcbiAgICAgICAgICBvdmVyZmxvdzpoaWRkZW47XG4gICAgICAgIH1cblxuICAgICAgICAudmlldy1hbmltYXRlIHtcbiAgICAgICAgICBwYWRkaW5nOjEwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyLCAudmlldy1hbmltYXRlLm5nLWxlYXZlIHtcbiAgICAgICAgICB0cmFuc2l0aW9uOmFsbCBjdWJpYy1iZXppZXIoMC4yNTAsIDAuNDYwLCAwLjQ1MCwgMC45NDApIDEuNXM7XG5cbiAgICAgICAgICBkaXNwbGF5OmJsb2NrO1xuICAgICAgICAgIHdpZHRoOjEwMCU7XG4gICAgICAgICAgYm9yZGVyLWxlZnQ6MXB4IHNvbGlkIGJsYWNrO1xuXG4gICAgICAgICAgcG9zaXRpb246YWJzb2x1dGU7XG4gICAgICAgICAgdG9wOjA7XG4gICAgICAgICAgbGVmdDowO1xuICAgICAgICAgIHJpZ2h0OjA7XG4gICAgICAgICAgYm90dG9tOjA7XG4gICAgICAgICAgcGFkZGluZzoxMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlciB7XG4gICAgICAgICAgbGVmdDoxMDAlO1xuICAgICAgICB9XG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIubmctZW50ZXItYWN0aXZlIHtcbiAgICAgICAgICBsZWZ0OjA7XG4gICAgICAgIH1cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1sZWF2ZS5uZy1sZWF2ZS1hY3RpdmUge1xuICAgICAgICAgIGxlZnQ6LTEwMCU7XG4gICAgICAgIH1cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cInNjcmlwdC5qc1wiPlxuICAgICAgICBhbmd1bGFyLm1vZHVsZSgnbmdWaWV3RXhhbXBsZScsIFsnbmdSb3V0ZScsICduZ0FuaW1hdGUnXSlcbiAgICAgICAgICAuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQnLCB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2Jvb2suaHRtbCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0N0cmwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9vaydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvQm9vay86Ym9va0lkL2NoLzpjaGFwdGVySWQnLCB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NoYXB0ZXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hhcHRlckN0cmwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY2hhcHRlcidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgICAgICAgfV0pXG4gICAgICAgICAgLmNvbnRyb2xsZXIoJ01haW5DdHJsJywgWyckcm91dGUnLCAnJHJvdXRlUGFyYW1zJywgJyRsb2NhdGlvbicsXG4gICAgICAgICAgICBmdW5jdGlvbigkcm91dGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgIHRoaXMuJHJvdXRlID0gJHJvdXRlO1xuICAgICAgICAgICAgICB0aGlzLiRsb2NhdGlvbiA9ICRsb2NhdGlvbjtcbiAgICAgICAgICAgICAgdGhpcy4kcm91dGVQYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pXG4gICAgICAgICAgLmNvbnRyb2xsZXIoJ0Jvb2tDdHJsJywgWyckcm91dGVQYXJhbXMnLCBmdW5jdGlvbigkcm91dGVQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IFwiQm9va0N0cmxcIjtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdDaGFwdGVyQ3RybCcsIFsnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24oJHJvdXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBcIkNoYXB0ZXJDdHJsXCI7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSk7XG5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cInByb3RyYWN0b3IuanNcIiB0eXBlPVwicHJvdHJhY3RvclwiPlxuICAgICAgICBpdCgnc2hvdWxkIGxvYWQgYW5kIGNvbXBpbGUgY29ycmVjdCB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGVsZW1lbnQoYnkubGlua1RleHQoJ01vYnk6IENoMScpKS5jbGljaygpO1xuICAgICAgICAgIHZhciBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQ2hhcHRlckN0cmwvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBNb2J5Lyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0NoYXB0ZXIgSWRcXDogMS8pO1xuXG4gICAgICAgICAgZWxlbWVudChieS5wYXJ0aWFsTGlua1RleHQoJ1NjYXJsZXQnKSkuY2xpY2soKTtcblxuICAgICAgICAgIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBCb29rQ3RybC8pO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IFNjYXJsZXQvKTtcbiAgICAgICAgfSk7XG4gICAgICA8L2ZpbGU+XG4gICAgPC9leGFtcGxlPlxuICovXG5cblxuLyoqXG4gKiBAbmdkb2MgZXZlbnRcbiAqIEBuYW1lIG5nVmlldyMkdmlld0NvbnRlbnRMb2FkZWRcbiAqIEBldmVudFR5cGUgZW1pdCBvbiB0aGUgY3VycmVudCBuZ1ZpZXcgc2NvcGVcbiAqIEBkZXNjcmlwdGlvblxuICogRW1pdHRlZCBldmVyeSB0aW1lIHRoZSBuZ1ZpZXcgY29udGVudCBpcyByZWxvYWRlZC5cbiAqL1xubmdWaWV3RmFjdG9yeS4kaW5qZWN0ID0gWyckcm91dGUnLCAnJGFuY2hvclNjcm9sbCcsICckYW5pbWF0ZSddO1xuZnVuY3Rpb24gbmdWaWV3RmFjdG9yeSgkcm91dGUsICRhbmNob3JTY3JvbGwsICRhbmltYXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIHByaW9yaXR5OiA0MDAsXG4gICAgdHJhbnNjbHVkZTogJ2VsZW1lbnQnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCwgYXR0ciwgY3RybCwgJHRyYW5zY2x1ZGUpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRTY29wZSxcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50LFxuICAgICAgICAgICAgcHJldmlvdXNMZWF2ZUFuaW1hdGlvbixcbiAgICAgICAgICAgIGF1dG9TY3JvbGxFeHAgPSBhdHRyLmF1dG9zY3JvbGwsXG4gICAgICAgICAgICBvbmxvYWRFeHAgPSBhdHRyLm9ubG9hZCB8fCAnJztcblxuICAgICAgICBzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCB1cGRhdGUpO1xuICAgICAgICB1cGRhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBjbGVhbnVwTGFzdFZpZXcoKSB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzTGVhdmVBbmltYXRpb24pIHtcbiAgICAgICAgICAgICRhbmltYXRlLmNhbmNlbChwcmV2aW91c0xlYXZlQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIHByZXZpb3VzTGVhdmVBbmltYXRpb24gPSBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjdXJyZW50U2NvcGUpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uID0gJGFuaW1hdGUubGVhdmUoY3VycmVudEVsZW1lbnQpO1xuICAgICAgICAgICAgcHJldmlvdXNMZWF2ZUFuaW1hdGlvbi50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3VycmVudEVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgICB2YXIgbG9jYWxzID0gJHJvdXRlLmN1cnJlbnQgJiYgJHJvdXRlLmN1cnJlbnQubG9jYWxzLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGxvY2FscyAmJiBsb2NhbHMuJHRlbXBsYXRlO1xuXG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgdmFyIG5ld1Njb3BlID0gc2NvcGUuJG5ldygpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSAkcm91dGUuY3VycmVudDtcblxuICAgICAgICAgICAgLy8gTm90ZTogVGhpcyB3aWxsIGFsc28gbGluayBhbGwgY2hpbGRyZW4gb2YgbmctdmlldyB0aGF0IHdlcmUgY29udGFpbmVkIGluIHRoZSBvcmlnaW5hbFxuICAgICAgICAgICAgLy8gaHRtbC4gSWYgdGhhdCBjb250ZW50IGNvbnRhaW5zIGNvbnRyb2xsZXJzLCAuLi4gdGhleSBjb3VsZCBwb2xsdXRlL2NoYW5nZSB0aGUgc2NvcGUuXG4gICAgICAgICAgICAvLyBIb3dldmVyLCB1c2luZyBuZy12aWV3IG9uIGFuIGVsZW1lbnQgd2l0aCBhZGRpdGlvbmFsIGNvbnRlbnQgZG9lcyBub3QgbWFrZSBzZW5zZS4uLlxuICAgICAgICAgICAgLy8gTm90ZTogV2UgY2FuJ3QgcmVtb3ZlIHRoZW0gaW4gdGhlIGNsb25lQXR0Y2hGbiBvZiAkdHJhbnNjbHVkZSBhcyB0aGF0XG4gICAgICAgICAgICAvLyBmdW5jdGlvbiBpcyBjYWxsZWQgYmVmb3JlIGxpbmtpbmcgdGhlIGNvbnRlbnQsIHdoaWNoIHdvdWxkIGFwcGx5IGNoaWxkXG4gICAgICAgICAgICAvLyBkaXJlY3RpdmVzIHRvIG5vbiBleGlzdGluZyBlbGVtZW50cy5cbiAgICAgICAgICAgIHZhciBjbG9uZSA9ICR0cmFuc2NsdWRlKG5ld1Njb3BlLCBmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICAgICAgICAkYW5pbWF0ZS5lbnRlcihjbG9uZSwgbnVsbCwgY3VycmVudEVsZW1lbnQgfHwgJGVsZW1lbnQpLnRoZW4oZnVuY3Rpb24gb25OZ1ZpZXdFbnRlcigpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoYXV0b1Njcm9sbEV4cClcbiAgICAgICAgICAgICAgICAgICYmICghYXV0b1Njcm9sbEV4cCB8fCBzY29wZS4kZXZhbChhdXRvU2Nyb2xsRXhwKSkpIHtcbiAgICAgICAgICAgICAgICAgICRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IGNsb25lO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gY3VycmVudC5zY29wZSA9IG5ld1Njb3BlO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRlbWl0KCckdmlld0NvbnRlbnRMb2FkZWQnKTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZXZhbChvbmxvYWRFeHApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8vIFRoaXMgZGlyZWN0aXZlIGlzIGNhbGxlZCBkdXJpbmcgdGhlICR0cmFuc2NsdWRlIGNhbGwgb2YgdGhlIGZpcnN0IGBuZ1ZpZXdgIGRpcmVjdGl2ZS5cbi8vIEl0IHdpbGwgcmVwbGFjZSBhbmQgY29tcGlsZSB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aXRoIHRoZSBsb2FkZWQgdGVtcGxhdGUuXG4vLyBXZSBuZWVkIHRoaXMgZGlyZWN0aXZlIHNvIHRoYXQgdGhlIGVsZW1lbnQgY29udGVudCBpcyBhbHJlYWR5IGZpbGxlZCB3aGVuXG4vLyB0aGUgbGluayBmdW5jdGlvbiBvZiBhbm90aGVyIGRpcmVjdGl2ZSBvbiB0aGUgc2FtZSBlbGVtZW50IGFzIG5nVmlld1xuLy8gaXMgY2FsbGVkLlxubmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5LiRpbmplY3QgPSBbJyRjb21waWxlJywgJyRjb250cm9sbGVyJywgJyRyb3V0ZSddO1xuZnVuY3Rpb24gbmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5KCRjb21waWxlLCAkY29udHJvbGxlciwgJHJvdXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHByaW9yaXR5OiAtNDAwLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSAkcm91dGUuY3VycmVudCxcbiAgICAgICAgICBsb2NhbHMgPSBjdXJyZW50LmxvY2FscztcblxuICAgICAgJGVsZW1lbnQuaHRtbChsb2NhbHMuJHRlbXBsYXRlKTtcblxuICAgICAgdmFyIGxpbmsgPSAkY29tcGlsZSgkZWxlbWVudC5jb250ZW50cygpKTtcblxuICAgICAgaWYgKGN1cnJlbnQuY29udHJvbGxlcikge1xuICAgICAgICBsb2NhbHMuJHNjb3BlID0gc2NvcGU7XG4gICAgICAgIHZhciBjb250cm9sbGVyID0gJGNvbnRyb2xsZXIoY3VycmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICBpZiAoY3VycmVudC5jb250cm9sbGVyQXMpIHtcbiAgICAgICAgICBzY29wZVtjdXJyZW50LmNvbnRyb2xsZXJBc10gPSBjb250cm9sbGVyO1xuICAgICAgICB9XG4gICAgICAgICRlbGVtZW50LmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICAgICRlbGVtZW50LmNoaWxkcmVuKCkuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjb250cm9sbGVyKTtcbiAgICAgIH1cbiAgICAgIHNjb3BlW2N1cnJlbnQucmVzb2x2ZUFzIHx8ICckcmVzb2x2ZSddID0gbG9jYWxzO1xuXG4gICAgICBsaW5rKHNjb3BlKTtcbiAgICB9XG4gIH07XG59XG5cblxufSkod2luZG93LCB3aW5kb3cuYW5ndWxhcik7XG4iXX0=
