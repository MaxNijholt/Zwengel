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

app.controller('AllController', ['$window', '$ionicPlatform', 'AllData', require('./app.controller.js')]);
app.controller('DoelenController', ['$ionicScrollDelegate', 'AllData', 'DoelenService', require('./doelen/doelen.controller.js')]);
app.controller('DoelController', ['$ionicScrollDelegate', '$routeParams', 'AllData', 'DoelenService', require('./doelen/doel.controller.js')]);

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
},{"./app.controller.js":1,"./app.service.js":3,"./doelen/doel.controller.js":4,"./doelen/doelen.controller.js":5,"./doelen/doelen.service.js":6,"angular-route/angular-route":7}],3:[function(require,module,exports){
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
        console.log(self.history);
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
    
    self.getDoelen = function(studentID, onSucces){
        dataCaller.getDoelen(studentID, onSucces);
    };
    
    self.getDoel = function(studentID, doelID, onSucces){
        dataCaller.getDoel(studentID, doelID, onSucces);
    };

	return {
        getDoelen: self.getDoelen,
        getDoel: self.getDoel
	};
};
},{}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmNvbnRyb2xsZXIuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2FwcC5zZXJ2aWNlLmpzIiwiYXBwL2pzL2RvZWxlbi9kb2VsLmNvbnRyb2xsZXIuanMiLCJhcHAvanMvZG9lbGVuL2RvZWxlbi5jb250cm9sbGVyLmpzIiwiYXBwL2pzL2RvZWxlbi9kb2VsZW4uc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9hbmd1bGFyLXJvdXRlL2FuZ3VsYXItcm91dGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHdpbmRvdywgJGlvbmljUGxhdGZvcm0sIEFsbERhdGEpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgc2VsZi5wYWdlID0gQWxsRGF0YS5wYWdlO1xyXG4gICAgXHJcbiAgICBzZWxmLm5hdkRvZWxlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgQWxsRGF0YS50b1BhZ2UoXCJEb2VsZW5cIiwgXCIjL2RvZWxlblwiKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNlbGYubmF2QmVsb25pbmdlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgQWxsRGF0YS50b1BhZ2UoXCJCZWxvbmluZ2VuXCIsIFwiIy9iZWxvbmluZ2VuXCIpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2VsZi5uYXZQcm9maWVsID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBBbGxEYXRhLnRvUGFnZShcIlByb2ZpZWxcIiwgXCIjL3Byb2ZpZWxcIik7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBzZWxmLmJhY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0QWxsRGF0YS50b0JhY2soKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgICRpb25pY1BsYXRmb3JtLnJlZ2lzdGVyQmFja0J1dHRvbkFjdGlvbihmdW5jdGlvbiAoKSB7XHJcblx0XHRBbGxEYXRhLnRvQmFjayh0cnVlKTtcclxuXHR9LCAxMDApO1xyXG59OyIsInJlcXVpcmUoJ2FuZ3VsYXItcm91dGUvYW5ndWxhci1yb3V0ZScpO1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCd6d2VuZ2VsQXBwJywgWyduZ1JvdXRlJywgJ2lvbmljJ10pO1xyXG5cclxuYXBwLmZhY3RvcnkoJ0FsbERhdGEnLCBbcmVxdWlyZSgnLi9hcHAuc2VydmljZS5qcycpXSk7XHJcbmFwcC5zZXJ2aWNlKCdEb2VsZW5TZXJ2aWNlJywgWyckaHR0cCcsIHJlcXVpcmUoJy4vZG9lbGVuL2RvZWxlbi5zZXJ2aWNlLmpzJyldKTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCdBbGxDb250cm9sbGVyJywgWyckd2luZG93JywgJyRpb25pY1BsYXRmb3JtJywgJ0FsbERhdGEnLCByZXF1aXJlKCcuL2FwcC5jb250cm9sbGVyLmpzJyldKTtcclxuYXBwLmNvbnRyb2xsZXIoJ0RvZWxlbkNvbnRyb2xsZXInLCBbJyRpb25pY1Njcm9sbERlbGVnYXRlJywgJ0FsbERhdGEnLCAnRG9lbGVuU2VydmljZScsIHJlcXVpcmUoJy4vZG9lbGVuL2RvZWxlbi5jb250cm9sbGVyLmpzJyldKTtcclxuYXBwLmNvbnRyb2xsZXIoJ0RvZWxDb250cm9sbGVyJywgWyckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsICckcm91dGVQYXJhbXMnLCAnQWxsRGF0YScsICdEb2VsZW5TZXJ2aWNlJywgcmVxdWlyZSgnLi9kb2VsZW4vZG9lbC5jb250cm9sbGVyLmpzJyldKTtcclxuXHJcbmFwcC5jb25maWcoWyckcm91dGVQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLlxyXG4gICAgICAgIHdoZW4oJy9kb2VsZW4nLCB7XHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RvZWxlbi5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdEb2VsZW5Db250cm9sbGVyIGFzIGRlbmMnXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgd2hlbignL2RvZWxlbi86ZG9lbElEJywge1xyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kb2VsLmh0bWwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlcjogJ0RvZWxDb250cm9sbGVyIGFzIGRjJ1xyXG4gICAgICAgIH0pLlxyXG4gICAgICAgIHdoZW4oJy9kb2VsZW4vOmRvZWxJRC86c3RhcElEJywge1xyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9zdGFwLmh0bWwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlcjogJ1N0YXBDb250cm9sbGVyIGFzIHNjJ1xyXG4gICAgICAgIH0pLlxyXG4gICAgICAgIHdoZW4oJy9iZWxvbmluZ2VuJywge1xyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9iZWxvbmluZ2VuLmh0bWwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlcjogJ0JlbG9uaW5nZW5Db250cm9sbGVyIGFzIGJlbmMnXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgd2hlbignL3Byb2ZpZWwnLCB7XHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3Byb2ZpZWwuaHRtbCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyOiAnUHJvZmllbENvbnRyb2xsZXIgYXMgcGMnXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgb3RoZXJ3aXNlKHtcclxuICAgICAgICBcdHJlZGlyZWN0VG86ICcvZG9lbGVuJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5dKTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBcclxuICAgIHNlbGYudG8gPSBmdW5jdGlvbih0aXRsZSwgdXJsKSB7XHJcbiAgICAgICAgc2VsZi5wYWdlLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgc2VsZi5wYWdlLnVybCA9IHVybDtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh1cmwpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZWxmLnB1c2hIaXN0b3J5ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICB0aXRsZTogc2VsZi5wYWdlLnRpdGxlLFxyXG4gICAgICAgICAgICB1cmw6IHNlbGYucGFnZS51cmxcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlbGYuaGlzdG9yeS5wdXNoKG9iamVjdCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coc2VsZi5oaXN0b3J5KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNlbGYucGFnZSA9IHtcclxuICAgICAgICB0aXRsZTogXCJEb2VsZW5cIixcclxuICAgICAgICB1cmw6IFwiIy9kb2VsZW5cIlxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2VsZi5wcmVmID0ge1xyXG4gICAgICAgIGRvZWxzY3JlZW46IFwibGlzdFwiLFxyXG4gICAgICAgIHRleHRJY29uczogXCJoYWxmXCJcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNlbGYuaGlzdG9yeSA9IFtdO1xyXG4gICAgXHJcbiAgICBzZWxmLnRvUGFnZSA9IGZ1bmN0aW9uKHRpdGxlLCB1cmwpe1xyXG4gICAgICAgIHNlbGYucHVzaEhpc3RvcnkoKTtcclxuICAgICAgICBzZWxmLnRvKHRpdGxlLCB1cmwpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2VsZi50b0JhY2sgPSBmdW5jdGlvbihwaG9uZUJhY2spe1xyXG4gICAgICAgIGlmKHNlbGYuaGlzdG9yeS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdmFyIGhpc3RvcnlJdGVtID0gc2VsZi5oaXN0b3J5LnBvcCgpO1xyXG4gICAgICAgICAgICBzZWxmLnRvKGhpc3RvcnlJdGVtLnRpdGxlLCBoaXN0b3J5SXRlbS51cmwsIGhpc3RvcnlJdGVtLmRvZWwsIGhpc3RvcnlJdGVtLnN0ZXApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBpZihwaG9uZUJhY2spe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSB3aW5kb3cuY29uZmlybShcIkFmc2x1aXRlblwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChjb25maXJtID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBuYXZpZ2F0b3IuYXBwLmV4aXRBcHAoKTsgLy9waG9uZWdoYXAgZXJyb3IgbWV0IHBsdWdpblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwYWdlOiBzZWxmLnBhZ2UsXHJcbiAgICAgICAgcHJlZjogc2VsZi5wcmVmLFxyXG4gICAgICAgIGhpc3Rvcnk6IHNlbGYuaGlzdG9yeSxcclxuICAgICAgICB0b1BhZ2U6IHNlbGYudG9QYWdlLFxyXG4gICAgICAgIHRvQmFjazogc2VsZi50b0JhY2tcclxuICAgIH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpb25pY1Njcm9sbERlbGVnYXRlLCAkcm91dGVQYXJhbXMsIEFsbERhdGEsIERvZWxlblNlcnZpY2UpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XHJcbiAgICB2YXIgZG9lbElEO1xyXG4gICAgXHJcbiAgICBEb2VsZW5TZXJ2aWNlLmdldERvZWwoXCJ0ZXN0XCIsICRyb3V0ZVBhcmFtcy5kb2VsSUQsIGZ1bmN0aW9uKHJlc3VsdHMpe1xyXG4gICAgICAgIHJlc3VsdHMuc3RlcHMuZm9yRWFjaChmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICAgICAgICBzd2l0Y2gob2JqZWN0LmRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJnb29kXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRvbmVDb2xvciA9IFwiYmFsYW5jZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJiYWRcIjpcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3QuZG9uZUNvbG9yID0gXCJhc3NlcnRpdmVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRvbmVDb2xvciA9IFwicG9zaXRpdmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlbGYuZG9lbCA9IHJlc3VsdHM7XHJcbiAgICAgICAgZG9lbElEID0gcmVzdWx0cy5pZDtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBzZWxmLnRvU3RhcCA9IGZ1bmN0aW9uKHN0YXBJRCl7XHJcbiAgICAgICAgQWxsRGF0YS50b1BhZ2UoXCJTdGFwXCIsIFwiIy9kb2VsZW4vXCIgKyBkb2VsSUQgKyBcIi9cIiArIHN0YXBJRCk7XHJcbiAgICB9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGlvbmljU2Nyb2xsRGVsZWdhdGUsIEFsbERhdGEsIERvZWxlblNlcnZpY2UpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XHJcbiAgICBcclxuICAgIERvZWxlblNlcnZpY2UuZ2V0RG9lbGVuKFwidGVzdFwiLCBmdW5jdGlvbihyZXN1bHRzKXtcclxuICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgc3dpdGNoKG9iamVjdC5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZ29vZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5kb25lQ29sb3IgPSBcImJhbGFuY2VkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYmFkXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRvbmVDb2xvciA9IFwiYXNzZXJ0aXZlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5kb25lQ29sb3IgPSBcInBvc2l0aXZlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxmLnRhcmdldHMgPSByZXN1bHRzO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIHNlbGYudG9Eb2VsID0gZnVuY3Rpb24oZG9lbElEKXtcclxuICAgICAgICBBbGxEYXRhLnRvUGFnZShcIkRvZWxcIiwgXCIjL2RvZWxlbi9cIiArIGRvZWxJRCk7XHJcbiAgICB9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGh0dHApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgZGF0YUNhbGxlciA9IHt9O1xyXG4gICAgXHJcbiAgICBkYXRhQ2FsbGVyLnRlc3RSZXN1bHQgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcImlkXCI6IFwidDFcIixcclxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIk92ZXJ0dWlnZW5cIixcclxuICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQga2FuIG1ldCBlZW4gbWVkZXN0dWRlbnQgaW4gZGlzY3Vzc2llIGdhYW4gZW4gZGUgYW5kZXIgdmFuIGVpZ2VuIG1lbmluZyBvdmVydHVpZ2VuLlwiLFxyXG4gICAgICAgICAgICBcImljb25cIjogXCJpb24tY2hhdGJ1YmJsZXNcIixcclxuICAgICAgICAgICAgXCJkb25lXCI6IFwiZG9pbmdcIixcclxuICAgICAgICAgICAgXCJtb3RpdmF0aW9uXCI6IG51bGwsXHJcbiAgICAgICAgICAgIFwic3RhcnREYXRlXCI6IFwiMDItMDItMjAxNlwiLFxyXG4gICAgICAgICAgICBcImVuZERhdGVcIjogXCIwNC0wOC0yMDE2XCIsXHJcbiAgICAgICAgICAgIFwic3RlcHNcIjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDFcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVnJhZ2VuIHN0ZWxsZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCB2cmFhZ3QgZWVuIG1lZGVzdHVkZW50IG9tIHppam4gbWVuaW5nLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIwMi0wMi0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJDb21wbGltZW50ZW4gdm9vciA1IHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQgaGVlZnQgNSB3ZWtlbiBsYW5nIGVsa2Ugd2VlayBlZW4gY29tcGxpbWVudCBhYW4gZWVuIG1lZGVzdHVkZW50IGdlZ2V2ZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjEyLTAzLTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjEyIGNvbXBsaW1lbnRlbiBpbiA0IHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIGxlZXJsaW5nIGhlZWZ0IDQgd2VrZW4gbGFuZyBlbGtlIHdlZWsgMyBjb21wbGltZW50ZW4gZ2VnZXZlbiBhYW4gbWVkZXN0dWRlbnRlbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJkb2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjI5LTA1LTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjIxIGNvbXBsaW1lbnRlbiBpbiAzIHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIjMgd2VrZW4gbGFuZyBoZWVmdCBkZSBzdHVkZW50IGVsa2UgZGFnIGVlbiBjb21wbGltZW50IGdlZ2V2ZW4gYWFuIGVlbiBtZWRlc3R1ZGVudC5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJkb2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjE0LTA3LTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0MlwiLFxyXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiRGUgcmVrZW50YWZlbHMga2VubmVuXCIsXHJcbiAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBzdHVkZW50IGtlbnQgZGUgdGFmZWxzIHZhbiAxIHRvdCBlbiBtZXQgMTAgdWl0IHppam4gaG9vZmQuXCIsXHJcbiAgICAgICAgICAgIFwiaWNvblwiOiBcImlvbi1jYWxjdWxhdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZG9uZVwiOiBcImRvaW5nXCIsXHJcbiAgICAgICAgICAgIFwibW90aXZhdGlvblwiOiBudWxsLFxyXG4gICAgICAgICAgICBcInN0YXJ0RGF0ZVwiOiBcIjAxLTAxLTIwMTZcIixcclxuICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMDQtMDUtMjAxNlwiLFxyXG4gICAgICAgICAgICBcInN0ZXBzXCI6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRhZmVscyAxLCAyIGVuIDNcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgbGVlcmxpbmcgbW9ldCBkZSB0YWZlbCB2YW4gMSwgMiBlbiAzIHVpdCB6aWpuIGhvb2ZkIGtlbm5lbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMjEtMDItMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDJcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVGFmZWxzIDQgZW4gNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBsZWVybGluZyBtb2V0IGRlIHRhZmVscyB2YW4gMSB0b3QgZW4gbWV0IDUgdWl0IHppam4gaG9vZmQga2VubmVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImJhZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjAyLTAzLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRhZmVscyA2IGVuIDdcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgbGVlcmxpbmcgbW9ldCBkZSB0YWZlbHMgdmFuIDEgdG90IGVuIG1ldCA3IHVpdCB6aWpuIGhvb2ZkIGtlbm5lbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJkb2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjI5LTAzLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRhZmVscyA4IGVuIDlcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiVGFmZWxzIDggZW4gOSB6aWpuIGVyZyBtb2VpbGlqayBlbiBtb2V0ZW4gb29rIGdlbGVlcmQgd29yZGVuLiBEZSBsZWVybGluZyBtb2V0IGRlIHRhZmVscyB2YW4gMSB0b3QgZW4gbWV0IDcgdWl0IHppam4gaG9vZmQga2VubmVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImRvaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMjEtMDQtMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDVcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVGFmZWwgdmFuIDEwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIjEwIGlzIHZyaWogbWFra2VsaWprLiBEZXplIG1vZXQgb29rIGdlbGVlcmQgd29yZGVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImRvaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMDQtMDUtMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJpZFwiOiBcInQzXCIsXHJcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJIZXQgV2lsaGVsbXVzIGtlbm5lblwiLFxyXG4gICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBrZW50IGhldCBXaWxoZWxtdXMgdWl0IHppam4gaG9vZmQuXCIsXHJcbiAgICAgICAgICAgIFwiaWNvblwiOiBcImlvbi12b2x1bWUtaGlnaFwiLFxyXG4gICAgICAgICAgICBcImRvbmVcIjogXCJkb2luZ1wiLFxyXG4gICAgICAgICAgICBcIm1vdGl2YXRpb25cIjogbnVsbCxcclxuICAgICAgICAgICAgXCJzdGFydERhdGVcIjogXCIwMS0wMi0yMDE2XCIsXHJcbiAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjAxLTA0LTIwMTZcIixcclxuICAgICAgICAgICAgXCJzdGVwc1wiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJFZXJzdGUgY291cGxldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBsZWVybGluZyBrZW50IGhldCBlZXJzdGUgY291cGxldCB1aXQgemlqbiBob29mZCBrZW5uZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjE1LTAyLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkVlcnN0ZSByZWZyZWluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIGxlZXJsaW5nIGtlbnQgaGV0IGVlcnN0ZSByZWZyZWluIHVpdCB6aWpuIGhvb2ZkIGtlbm5lbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMDEtMDMtMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDNcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVHdlZWRlIGNvdXBsZXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgbGVlcmxpbmcga2VudCBoZXQgdHdlZWRlIGNvdXBsZXQgdWl0IHppam4gaG9vZmQga2VubmVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIxMS0wMy0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0NFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJUd2VlZGUgcmVmcmVpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBsZWVybGluZyBrZW50IGhldCB0d2VlZGUgcmVmcmVpbiB1aXQgemlqbiBob29mZCBrZW5uZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjIyLTAzLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkRlcmRlIGNvdXBsZXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgbGVlcmxpbmcga2VudCBoZXQgZGVyZGUgY291cGxldCB1aXQgemlqbiBob29mZCBrZW5uZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZG9pbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIwMS0wNC0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcImlkXCI6IFwidDRcIixcclxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIk1pbmRlciBwcmF0ZW4gdGlqZGVucyBkZSBsZXNcIixcclxuICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQga2FuIHppY2ggbGFuZ2VyZSB0aWpkIHN0aWwgaG91ZGVuIGluIGRlIGxlcy4gSGllcmJpaiBpcyBoZXQgZG9lbCBvbSAxNSBtaW51dGVuIGxhbmcgbmlrcyB0ZSB6ZWdnZW5cIixcclxuICAgICAgICAgICAgXCJpY29uXCI6IFwiaW9uLXZvbHVtZS1sb3dcIixcclxuICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICBcIm1vdGl2YXRpb25cIjogNCxcclxuICAgICAgICAgICAgXCJzdGFydERhdGVcIjogXCIyOS0wMS0yMDE2XCIsXHJcbiAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjA1LTAzLTIwMTZcIixcclxuICAgICAgICAgICAgXCJzdGVwc1wiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCI0eDIgbWluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIjQga2VlciAyIG1pbiBpbiBkZSBsZXMgbmlrcyB6ZWdnZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMTAtMDItMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDJcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiNHgzIG1pblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCI0IGtlZXIgMyBtaW4gaW4gZGUgbGVzIG5pa3MgemVnZ2VuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIxMi0wMi0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0M1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCIyeDUgbWluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIjIga2VlciBtb2V0IGluIGRlIGxlcyA1IG1pbnV0ZW4gbGFuZyBuaWtzIGdlemVnZCB3b3JkZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjE3LTAyLTIwMTZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjJ4NyBtaW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBtb2V0IGluIGRlIGxlcyA3IG1pbnV0ZW4gbGFuZyBuaWtzIHplZ2dlbi4gRGl0IG1vZXQgdGlqZGVucyBlZW4gbGVzIDIga2VlciBnZWRhYW4gd29yZGVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIyNS0wMi0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0NVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCIxeDEwIG1pblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCIxIGtlZXIgc3RpbCB6aWpuIDEwIG1pbnV0ZW4gbGFuZy5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMjktMDItMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDZcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiMXgxNSBtaW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBtb2V0IGVlbiBrd2FydGllciBsYW5nIHN0aWwgemlqbiB0aWpkZW5zIGRlIGxlcy5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMDUtMDMtMjAxNlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJpZFwiOiBcInQ1XCIsXHJcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJQbGFubmluZyBuYWtvbWVuXCIsXHJcbiAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBzdHVkZW50IGthbiBkZSBwbGFubmluZyBuYWtvbWVuIGRpZSBoZW0gYWFuIGhldCBiZWdpbiB2YW4gZGUgbWFhbmQgZ2VnZXZlbiBpcywgbmFrb21lbi5cIixcclxuICAgICAgICAgICAgXCJpY29uXCI6IFwiaW9uLWNhbGVuZGFyXCIsXHJcbiAgICAgICAgICAgIFwiZG9uZVwiOiBcImJhZFwiLFxyXG4gICAgICAgICAgICBcIm1vdGl2YXRpb25cIjogMSxcclxuICAgICAgICAgICAgXCJzdGFydERhdGVcIjogXCIwMS0wNy0yMDE1XCIsXHJcbiAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjMxLTAxLTIwMTZcIixcclxuICAgICAgICAgICAgXCJzdGVwc1wiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCI0IHZhbiBkZSAxMCB0YWtlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBYW4gaGV0IGVpbmQgdmFuIGRlIG1hYW5kIG1vZXRlbiA0IHZhbiBkZSAxMCB0YWtlbiBhZiB6aWpuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0wNy0yMDE1XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCI1IHZhbiBkZSAxMCB0YWtlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEZSBoZWxmdCB2YW4gZGUgdGFrZW4gbW9ldCBhYW4gaGV0IGVpbmQgdmFuIGRlIG1hYW5kIGFmIHppam4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiYmFkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMzEtMDgtMjAxNVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDNcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiNiB2YW4gZGUgMTAgdGFrZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiNiB0YWtlbiBtb2V0ZW4gYWFuIGhldCBlaW5kIHZhbiBkZSBtYWFuZCBhZiB6aWpuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImJhZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjMxLTA5LTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3Q0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjcgdmFuIGRlIDEwIHRha2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQgbW9ldCA3IHRha2VuIHZhbiBkZSAxMCBhZiBoZWJiZW4gYWFuIGhldCBlaW5kZSB2YW4gZGUgbWFhbmQuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiYmFkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMzEtMTAtMjAxNVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDVcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiOCB2YW4gZGUgMTAgdGFrZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQWFuIGhldCBlaW5kZSB2YW4gZGUgbWFhbmQgbW9ldGVuIDggdGFrZW4gYWYgemlqbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJiYWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0xMS0yMDE1XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0NlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCI5IHZhbiBkZSAxMCB0YWtlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCI5IHZhbiBkZSAxMCB0YWtlbiBtb2V0ZW4gemlqbiBhZmdlcm9uZCBhYW4gaGV0IGVpbmRlIHZhbiBkZSBtYWFuZC5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJiYWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0xMi0yMDE1XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0N1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCIxMCB2YW4gZGUgMTAgdGFrZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBtb2V0IHppam4gcGxhbm5pbmcgdm9sbGVkaWcgaGViYmVuIG5hZ2Vrb21lbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJiYWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0wMS0yMDE2XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcImlkXCI6IFwidDZcIixcclxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkNvbXBsaW1lbnRlbiBnZXZlblwiLFxyXG4gICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRGUgc3R1ZGVudCBtb2V0IGRhZ2VsaWprcyBlZW4gY29tcGxpbWVudCBnZXZlbiBhYW4gZWVuIG1lZGVsZWVybGluZ1wiLFxyXG4gICAgICAgICAgICBcImljb25cIjogXCJpb24tYW5kcm9pZC1jb250YWN0c1wiLFxyXG4gICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgIFwibW90aXZhdGlvblwiOiA1LFxyXG4gICAgICAgICAgICBcInN0YXJ0RGF0ZVwiOiBcIjE5LTExLTIwMTRcIixcclxuICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMTAtMDUtMjAxNVwiLFxyXG4gICAgICAgICAgICBcInN0ZXBzXCI6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkVlcnN0ZSBjb21wbGltZW50XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIGxlZXJsaW5nIGhlZWZ0IGVlbiBtZWRlc3R1ZGVudCBlZW4gY29tcGxpbWVudCBnZWdldmVuLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIzMS0xMi0yMDE0XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcInN0MlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJDb21wbGltZW50ZW4gdm9vciA1IHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIHN0dWRlbnQgaGVlZnQgNSB3ZWtlbiBsYW5nIGVsa2Ugd2VlayBlZW4gY29tcGxpbWVudCBhYW4gZWVuIG1lZGVzdHVkZW50IGdlZ2V2ZW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkb25lXCI6IFwiZ29vZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kRGF0ZVwiOiBcIjEyLTAzLTIwMTVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwic3QzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIjEyIGNvbXBsaW1lbnRlbiBpbiA0IHdla2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkRlIGxlZXJsaW5nIGhlZWZ0IDQgd2VrZW4gbGFuZyBlbGtlIHdlZWsgMyBjb21wbGltZW50ZW4gZ2VnZXZlbiBhYW4gbWVkZXN0dWRlbnRlbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRvbmVcIjogXCJnb29kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmREYXRlXCI6IFwiMjktMDUtMjAxNVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJzdDRcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiMjEgY29tcGxpbWVudGVuIGluIDMgd2VrZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiMyB3ZWtlbiBsYW5nIGhlZWZ0IGRlIHN0dWRlbnQgZWxrZSBkYWcgZWVuIGNvbXBsaW1lbnQgZ2VnZXZlbiBhYW4gZWVuIG1lZGVzdHVkZW50LlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZG9uZVwiOiBcImdvb2RcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZERhdGVcIjogXCIxNC0wNy0yMDE1XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgZGF0YUNhbGxlci5nZXREb2VsZW4gPSBmdW5jdGlvbihzdHVkZW50SUQsIG9uU3VjY2VzKXsgICAgXHJcbiAgICAgICAgb25TdWNjZXMoZGF0YUNhbGxlci50ZXN0UmVzdWx0KTtcclxuICAgIH07XHJcblxyXG4gICAgZGF0YUNhbGxlci5nZXREb2VsID0gZnVuY3Rpb24oc3R1ZGVudElELCBkb2VsSUQsIG9uU3VjY2VzKXtcclxuICAgICAgICB2YXIgZG9lbCA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZGF0YUNhbGxlci50ZXN0UmVzdWx0LmZvckVhY2goZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgICAgICAgaWYob2JqZWN0LmlkID09PSBkb2VsSUQpe1xyXG4gICAgICAgICAgICAgICAgZG9lbCA9IG9iamVjdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG9uU3VjY2VzKGRvZWwpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2VsZi5nZXREb2VsZW4gPSBmdW5jdGlvbihzdHVkZW50SUQsIG9uU3VjY2VzKXtcclxuICAgICAgICBkYXRhQ2FsbGVyLmdldERvZWxlbihzdHVkZW50SUQsIG9uU3VjY2VzKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNlbGYuZ2V0RG9lbCA9IGZ1bmN0aW9uKHN0dWRlbnRJRCwgZG9lbElELCBvblN1Y2Nlcyl7XHJcbiAgICAgICAgZGF0YUNhbGxlci5nZXREb2VsKHN0dWRlbnRJRCwgZG9lbElELCBvblN1Y2Nlcyk7XHJcbiAgICB9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG4gICAgICAgIGdldERvZWxlbjogc2VsZi5nZXREb2VsZW4sXHJcbiAgICAgICAgZ2V0RG9lbDogc2VsZi5nZXREb2VsXHJcblx0fTtcclxufTsiLCIvKipcbiAqIEBsaWNlbnNlIEFuZ3VsYXJKUyB2MS41LjVcbiAqIChjKSAyMDEwLTIwMTYgR29vZ2xlLCBJbmMuIGh0dHA6Ly9hbmd1bGFyanMub3JnXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhcikgeyd1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmdkb2MgbW9kdWxlXG4gKiBAbmFtZSBuZ1JvdXRlXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiAjIG5nUm91dGVcbiAqXG4gKiBUaGUgYG5nUm91dGVgIG1vZHVsZSBwcm92aWRlcyByb3V0aW5nIGFuZCBkZWVwbGlua2luZyBzZXJ2aWNlcyBhbmQgZGlyZWN0aXZlcyBmb3IgYW5ndWxhciBhcHBzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNlZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjZXhhbXBsZSAkcm91dGV9IGZvciBhbiBleGFtcGxlIG9mIGNvbmZpZ3VyaW5nIGFuZCB1c2luZyBgbmdSb3V0ZWAuXG4gKlxuICpcbiAqIDxkaXYgZG9jLW1vZHVsZS1jb21wb25lbnRzPVwibmdSb3V0ZVwiPjwvZGl2PlxuICovXG4gLyogZ2xvYmFsIC1uZ1JvdXRlTW9kdWxlICovXG52YXIgbmdSb3V0ZU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCduZ1JvdXRlJywgWyduZyddKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyKCckcm91dGUnLCAkUm91dGVQcm92aWRlciksXG4gICAgJHJvdXRlTWluRXJyID0gYW5ndWxhci4kJG1pbkVycignbmdSb3V0ZScpO1xuXG4vKipcbiAqIEBuZ2RvYyBwcm92aWRlclxuICogQG5hbWUgJHJvdXRlUHJvdmlkZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBVc2VkIGZvciBjb25maWd1cmluZyByb3V0ZXMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU2VlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSNleGFtcGxlICRyb3V0ZX0gZm9yIGFuIGV4YW1wbGUgb2YgY29uZmlndXJpbmcgYW5kIHVzaW5nIGBuZ1JvdXRlYC5cbiAqXG4gKiAjIyBEZXBlbmRlbmNpZXNcbiAqIFJlcXVpcmVzIHRoZSB7QGxpbmsgbmdSb3V0ZSBgbmdSb3V0ZWB9IG1vZHVsZSB0byBiZSBpbnN0YWxsZWQuXG4gKi9cbmZ1bmN0aW9uICRSb3V0ZVByb3ZpZGVyKCkge1xuICBmdW5jdGlvbiBpbmhlcml0KHBhcmVudCwgZXh0cmEpIHtcbiAgICByZXR1cm4gYW5ndWxhci5leHRlbmQoT2JqZWN0LmNyZWF0ZShwYXJlbnQpLCBleHRyYSk7XG4gIH1cblxuICB2YXIgcm91dGVzID0ge307XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjd2hlblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBSb3V0ZSBwYXRoIChtYXRjaGVkIGFnYWluc3QgYCRsb2NhdGlvbi5wYXRoYCkuIElmIGAkbG9jYXRpb24ucGF0aGBcbiAgICogICAgY29udGFpbnMgcmVkdW5kYW50IHRyYWlsaW5nIHNsYXNoIG9yIGlzIG1pc3Npbmcgb25lLCB0aGUgcm91dGUgd2lsbCBzdGlsbCBtYXRjaCBhbmQgdGhlXG4gICAqICAgIGAkbG9jYXRpb24ucGF0aGAgd2lsbCBiZSB1cGRhdGVkIHRvIGFkZCBvciBkcm9wIHRoZSB0cmFpbGluZyBzbGFzaCB0byBleGFjdGx5IG1hdGNoIHRoZVxuICAgKiAgICByb3V0ZSBkZWZpbml0aW9uLlxuICAgKlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBuYW1lZCBncm91cHMgc3RhcnRpbmcgd2l0aCBhIGNvbG9uOiBlLmcuIGA6bmFtZWAuIEFsbCBjaGFyYWN0ZXJzIHVwXG4gICAqICAgICAgICB0byB0aGUgbmV4dCBzbGFzaCBhcmUgbWF0Y2hlZCBhbmQgc3RvcmVkIGluIGAkcm91dGVQYXJhbXNgIHVuZGVyIHRoZSBnaXZlbiBgbmFtZWBcbiAgICogICAgICAgIHdoZW4gdGhlIHJvdXRlIG1hdGNoZXMuXG4gICAqICAgICogYHBhdGhgIGNhbiBjb250YWluIG5hbWVkIGdyb3VwcyBzdGFydGluZyB3aXRoIGEgY29sb24gYW5kIGVuZGluZyB3aXRoIGEgc3RhcjpcbiAgICogICAgICAgIGUuZy5gOm5hbWUqYC4gQWxsIGNoYXJhY3RlcnMgYXJlIGVhZ2VybHkgc3RvcmVkIGluIGAkcm91dGVQYXJhbXNgIHVuZGVyIHRoZSBnaXZlbiBgbmFtZWBcbiAgICogICAgICAgIHdoZW4gdGhlIHJvdXRlIG1hdGNoZXMuXG4gICAqICAgICogYHBhdGhgIGNhbiBjb250YWluIG9wdGlvbmFsIG5hbWVkIGdyb3VwcyB3aXRoIGEgcXVlc3Rpb24gbWFyazogZS5nLmA6bmFtZT9gLlxuICAgKlxuICAgKiAgICBGb3IgZXhhbXBsZSwgcm91dGVzIGxpa2UgYC9jb2xvci86Y29sb3IvbGFyZ2Vjb2RlLzpsYXJnZWNvZGUqXFwvZWRpdGAgd2lsbCBtYXRjaFxuICAgKiAgICBgL2NvbG9yL2Jyb3duL2xhcmdlY29kZS9jb2RlL3dpdGgvc2xhc2hlcy9lZGl0YCBhbmQgZXh0cmFjdDpcbiAgICpcbiAgICogICAgKiBgY29sb3I6IGJyb3duYFxuICAgKiAgICAqIGBsYXJnZWNvZGU6IGNvZGUvd2l0aC9zbGFzaGVzYC5cbiAgICpcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJvdXRlIE1hcHBpbmcgaW5mb3JtYXRpb24gdG8gYmUgYXNzaWduZWQgdG8gYCRyb3V0ZS5jdXJyZW50YCBvbiByb3V0ZVxuICAgKiAgICBtYXRjaC5cbiAgICpcbiAgICogICAgT2JqZWN0IHByb3BlcnRpZXM6XG4gICAqXG4gICAqICAgIC0gYGNvbnRyb2xsZXJgIOKAkyBgeyhzdHJpbmd8ZnVuY3Rpb24oKT19YCDigJMgQ29udHJvbGxlciBmbiB0aGF0IHNob3VsZCBiZSBhc3NvY2lhdGVkIHdpdGhcbiAgICogICAgICBuZXdseSBjcmVhdGVkIHNjb3BlIG9yIHRoZSBuYW1lIG9mIGEge0BsaW5rIGFuZ3VsYXIuTW9kdWxlI2NvbnRyb2xsZXIgcmVnaXN0ZXJlZFxuICAgKiAgICAgIGNvbnRyb2xsZXJ9IGlmIHBhc3NlZCBhcyBhIHN0cmluZy5cbiAgICogICAgLSBgY29udHJvbGxlckFzYCDigJMgYHtzdHJpbmc9fWAg4oCTIEFuIGlkZW50aWZpZXIgbmFtZSBmb3IgYSByZWZlcmVuY2UgdG8gdGhlIGNvbnRyb2xsZXIuXG4gICAqICAgICAgSWYgcHJlc2VudCwgdGhlIGNvbnRyb2xsZXIgd2lsbCBiZSBwdWJsaXNoZWQgdG8gc2NvcGUgdW5kZXIgdGhlIGBjb250cm9sbGVyQXNgIG5hbWUuXG4gICAqICAgIC0gYHRlbXBsYXRlYCDigJMgYHtzdHJpbmc9fGZ1bmN0aW9uKCk9fWAg4oCTIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgb3IgYSBmdW5jdGlvbiB0aGF0XG4gICAqICAgICAgcmV0dXJucyBhbiBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIHdoaWNoIHNob3VsZCBiZSB1c2VkIGJ5IHtAbGlua1xuICAgKiAgICAgIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9IG9yIHtAbGluayBuZy5kaXJlY3RpdmU6bmdJbmNsdWRlIG5nSW5jbHVkZX0gZGlyZWN0aXZlcy5cbiAgICogICAgICBUaGlzIHByb3BlcnR5IHRha2VzIHByZWNlZGVuY2Ugb3ZlciBgdGVtcGxhdGVVcmxgLlxuICAgKlxuICAgKiAgICAgIElmIGB0ZW1wbGF0ZWAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgICAgLSBge0FycmF5LjxPYmplY3Q+fWAgLSByb3V0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICAgICAgICBgJGxvY2F0aW9uLnBhdGgoKWAgYnkgYXBwbHlpbmcgdGhlIGN1cnJlbnQgcm91dGVcbiAgICpcbiAgICogICAgLSBgdGVtcGxhdGVVcmxgIOKAkyBge3N0cmluZz18ZnVuY3Rpb24oKT19YCDigJMgcGF0aCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwYXRoIHRvIGFuIGh0bWxcbiAgICogICAgICB0ZW1wbGF0ZSB0aGF0IHNob3VsZCBiZSB1c2VkIGJ5IHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fS5cbiAgICpcbiAgICogICAgICBJZiBgdGVtcGxhdGVVcmxgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtBcnJheS48T2JqZWN0Pn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlXG4gICAqXG4gICAqICAgIC0gYHJlc29sdmVgIC0gYHtPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+PX1gIC0gQW4gb3B0aW9uYWwgbWFwIG9mIGRlcGVuZGVuY2llcyB3aGljaCBzaG91bGRcbiAgICogICAgICBiZSBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBJZiBhbnkgb2YgdGhlc2UgZGVwZW5kZW5jaWVzIGFyZSBwcm9taXNlcywgdGhlIHJvdXRlclxuICAgKiAgICAgIHdpbGwgd2FpdCBmb3IgdGhlbSBhbGwgdG8gYmUgcmVzb2x2ZWQgb3Igb25lIHRvIGJlIHJlamVjdGVkIGJlZm9yZSB0aGUgY29udHJvbGxlciBpc1xuICAgKiAgICAgIGluc3RhbnRpYXRlZC5cbiAgICogICAgICBJZiBhbGwgdGhlIHByb21pc2VzIGFyZSByZXNvbHZlZCBzdWNjZXNzZnVsbHksIHRoZSB2YWx1ZXMgb2YgdGhlIHJlc29sdmVkIHByb21pc2VzIGFyZVxuICAgKiAgICAgIGluamVjdGVkIGFuZCB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjJHJvdXRlQ2hhbmdlU3VjY2VzcyAkcm91dGVDaGFuZ2VTdWNjZXNzfSBldmVudCBpc1xuICAgKiAgICAgIGZpcmVkLiBJZiBhbnkgb2YgdGhlIHByb21pc2VzIGFyZSByZWplY3RlZCB0aGVcbiAgICogICAgICB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjJHJvdXRlQ2hhbmdlRXJyb3IgJHJvdXRlQ2hhbmdlRXJyb3J9IGV2ZW50IGlzIGZpcmVkLlxuICAgKiAgICAgIEZvciBlYXNpZXIgYWNjZXNzIHRvIHRoZSByZXNvbHZlZCBkZXBlbmRlbmNpZXMgZnJvbSB0aGUgdGVtcGxhdGUsIHRoZSBgcmVzb2x2ZWAgbWFwIHdpbGxcbiAgICogICAgICBiZSBhdmFpbGFibGUgb24gdGhlIHNjb3BlIG9mIHRoZSByb3V0ZSwgdW5kZXIgYCRyZXNvbHZlYCAoYnkgZGVmYXVsdCkgb3IgYSBjdXN0b20gbmFtZVxuICAgKiAgICAgIHNwZWNpZmllZCBieSB0aGUgYHJlc29sdmVBc2AgcHJvcGVydHkgKHNlZSBiZWxvdykuIFRoaXMgY2FuIGJlIHBhcnRpY3VsYXJseSB1c2VmdWwsIHdoZW5cbiAgICogICAgICB3b3JraW5nIHdpdGgge0BsaW5rIGFuZ3VsYXIuTW9kdWxlI2NvbXBvbmVudCBjb21wb25lbnRzfSBhcyByb3V0ZSB0ZW1wbGF0ZXMuPGJyIC8+XG4gICAqICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LXdhcm5pbmdcIj5cbiAgICogICAgICAgICoqTm90ZToqKiBJZiB5b3VyIHNjb3BlIGFscmVhZHkgY29udGFpbnMgYSBwcm9wZXJ0eSB3aXRoIHRoaXMgbmFtZSwgaXQgd2lsbCBiZSBoaWRkZW5cbiAgICogICAgICAgIG9yIG92ZXJ3cml0dGVuLiBNYWtlIHN1cmUsIHlvdSBzcGVjaWZ5IGFuIGFwcHJvcHJpYXRlIG5hbWUgZm9yIHRoaXMgcHJvcGVydHksIHRoYXRcbiAgICogICAgICAgIGRvZXMgbm90IGNvbGxpZGUgd2l0aCBvdGhlciBwcm9wZXJ0aWVzIG9uIHRoZSBzY29wZS5cbiAgICogICAgICA8L2Rpdj5cbiAgICogICAgICBUaGUgbWFwIG9iamVjdCBpczpcbiAgICpcbiAgICogICAgICAtIGBrZXlgIOKAkyBge3N0cmluZ31gOiBhIG5hbWUgb2YgYSBkZXBlbmRlbmN5IHRvIGJlIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuXG4gICAqICAgICAgLSBgZmFjdG9yeWAgLSBge3N0cmluZ3xmdW5jdGlvbn1gOiBJZiBgc3RyaW5nYCB0aGVuIGl0IGlzIGFuIGFsaWFzIGZvciBhIHNlcnZpY2UuXG4gICAqICAgICAgICBPdGhlcndpc2UgaWYgZnVuY3Rpb24sIHRoZW4gaXQgaXMge0BsaW5rIGF1dG8uJGluamVjdG9yI2ludm9rZSBpbmplY3RlZH1cbiAgICogICAgICAgIGFuZCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRyZWF0ZWQgYXMgdGhlIGRlcGVuZGVuY3kuIElmIHRoZSByZXN1bHQgaXMgYSBwcm9taXNlLCBpdCBpc1xuICAgKiAgICAgICAgcmVzb2x2ZWQgYmVmb3JlIGl0cyB2YWx1ZSBpcyBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBCZSBhd2FyZSB0aGF0XG4gICAqICAgICAgICBgbmdSb3V0ZS4kcm91dGVQYXJhbXNgIHdpbGwgc3RpbGwgcmVmZXIgdG8gdGhlIHByZXZpb3VzIHJvdXRlIHdpdGhpbiB0aGVzZSByZXNvbHZlXG4gICAqICAgICAgICBmdW5jdGlvbnMuICBVc2UgYCRyb3V0ZS5jdXJyZW50LnBhcmFtc2AgdG8gYWNjZXNzIHRoZSBuZXcgcm91dGUgcGFyYW1ldGVycywgaW5zdGVhZC5cbiAgICpcbiAgICogICAgLSBgcmVzb2x2ZUFzYCAtIGB7c3RyaW5nPX1gIC0gVGhlIG5hbWUgdW5kZXIgd2hpY2ggdGhlIGByZXNvbHZlYCBtYXAgd2lsbCBiZSBhdmFpbGFibGUgb25cbiAgICogICAgICB0aGUgc2NvcGUgb2YgdGhlIHJvdXRlLiBJZiBvbWl0dGVkLCBkZWZhdWx0cyB0byBgJHJlc29sdmVgLlxuICAgKlxuICAgKiAgICAtIGByZWRpcmVjdFRvYCDigJMgYHsoc3RyaW5nfGZ1bmN0aW9uKCkpPX1gIOKAkyB2YWx1ZSB0byB1cGRhdGVcbiAgICogICAgICB7QGxpbmsgbmcuJGxvY2F0aW9uICRsb2NhdGlvbn0gcGF0aCB3aXRoIGFuZCB0cmlnZ2VyIHJvdXRlIHJlZGlyZWN0aW9uLlxuICAgKlxuICAgKiAgICAgIElmIGByZWRpcmVjdFRvYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7T2JqZWN0LjxzdHJpbmc+fWAgLSByb3V0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICAgICAgICBgJGxvY2F0aW9uLnBhdGgoKWAgYnkgYXBwbHlpbmcgdGhlIGN1cnJlbnQgcm91dGUgdGVtcGxhdGVVcmwuXG4gICAqICAgICAgLSBge3N0cmluZ31gIC0gY3VycmVudCBgJGxvY2F0aW9uLnBhdGgoKWBcbiAgICogICAgICAtIGB7T2JqZWN0fWAgLSBjdXJyZW50IGAkbG9jYXRpb24uc2VhcmNoKClgXG4gICAqXG4gICAqICAgICAgVGhlIGN1c3RvbSBgcmVkaXJlY3RUb2AgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gcmV0dXJuIGEgc3RyaW5nIHdoaWNoIHdpbGwgYmUgdXNlZFxuICAgKiAgICAgIHRvIHVwZGF0ZSBgJGxvY2F0aW9uLnBhdGgoKWAgYW5kIGAkbG9jYXRpb24uc2VhcmNoKClgLlxuICAgKlxuICAgKiAgICAtIGBbcmVsb2FkT25TZWFyY2g9dHJ1ZV1gIC0gYHtib29sZWFuPX1gIC0gcmVsb2FkIHJvdXRlIHdoZW4gb25seSBgJGxvY2F0aW9uLnNlYXJjaCgpYFxuICAgKiAgICAgIG9yIGAkbG9jYXRpb24uaGFzaCgpYCBjaGFuZ2VzLlxuICAgKlxuICAgKiAgICAgIElmIHRoZSBvcHRpb24gaXMgc2V0IHRvIGBmYWxzZWAgYW5kIHVybCBpbiB0aGUgYnJvd3NlciBjaGFuZ2VzLCB0aGVuXG4gICAqICAgICAgYCRyb3V0ZVVwZGF0ZWAgZXZlbnQgaXMgYnJvYWRjYXN0ZWQgb24gdGhlIHJvb3Qgc2NvcGUuXG4gICAqXG4gICAqICAgIC0gYFtjYXNlSW5zZW5zaXRpdmVNYXRjaD1mYWxzZV1gIC0gYHtib29sZWFuPX1gIC0gbWF0Y2ggcm91dGVzIHdpdGhvdXQgYmVpbmcgY2FzZSBzZW5zaXRpdmVcbiAgICpcbiAgICogICAgICBJZiB0aGUgb3B0aW9uIGlzIHNldCB0byBgdHJ1ZWAsIHRoZW4gdGhlIHBhcnRpY3VsYXIgcm91dGUgY2FuIGJlIG1hdGNoZWQgd2l0aG91dCBiZWluZ1xuICAgKiAgICAgIGNhc2Ugc2Vuc2l0aXZlXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHNlbGZcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFkZHMgYSBuZXcgcm91dGUgZGVmaW5pdGlvbiB0byB0aGUgYCRyb3V0ZWAgc2VydmljZS5cbiAgICovXG4gIHRoaXMud2hlbiA9IGZ1bmN0aW9uKHBhdGgsIHJvdXRlKSB7XG4gICAgLy9jb3B5IG9yaWdpbmFsIHJvdXRlIG9iamVjdCB0byBwcmVzZXJ2ZSBwYXJhbXMgaW5oZXJpdGVkIGZyb20gcHJvdG8gY2hhaW5cbiAgICB2YXIgcm91dGVDb3B5ID0gYW5ndWxhci5jb3B5KHJvdXRlKTtcbiAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChyb3V0ZUNvcHkucmVsb2FkT25TZWFyY2gpKSB7XG4gICAgICByb3V0ZUNvcHkucmVsb2FkT25TZWFyY2ggPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChyb3V0ZUNvcHkuY2FzZUluc2Vuc2l0aXZlTWF0Y2gpKSB7XG4gICAgICByb3V0ZUNvcHkuY2FzZUluc2Vuc2l0aXZlTWF0Y2ggPSB0aGlzLmNhc2VJbnNlbnNpdGl2ZU1hdGNoO1xuICAgIH1cbiAgICByb3V0ZXNbcGF0aF0gPSBhbmd1bGFyLmV4dGVuZChcbiAgICAgIHJvdXRlQ29weSxcbiAgICAgIHBhdGggJiYgcGF0aFJlZ0V4cChwYXRoLCByb3V0ZUNvcHkpXG4gICAgKTtcblxuICAgIC8vIGNyZWF0ZSByZWRpcmVjdGlvbiBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgIGlmIChwYXRoKSB7XG4gICAgICB2YXIgcmVkaXJlY3RQYXRoID0gKHBhdGhbcGF0aC5sZW5ndGggLSAxXSA9PSAnLycpXG4gICAgICAgICAgICA/IHBhdGguc3Vic3RyKDAsIHBhdGgubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIDogcGF0aCArICcvJztcblxuICAgICAgcm91dGVzW3JlZGlyZWN0UGF0aF0gPSBhbmd1bGFyLmV4dGVuZChcbiAgICAgICAge3JlZGlyZWN0VG86IHBhdGh9LFxuICAgICAgICBwYXRoUmVnRXhwKHJlZGlyZWN0UGF0aCwgcm91dGVDb3B5KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIHByb3BlcnR5XG4gICAqIEBuYW1lICRyb3V0ZVByb3ZpZGVyI2Nhc2VJbnNlbnNpdGl2ZU1hdGNoXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBBIGJvb2xlYW4gcHJvcGVydHkgaW5kaWNhdGluZyBpZiByb3V0ZXMgZGVmaW5lZFxuICAgKiB1c2luZyB0aGlzIHByb3ZpZGVyIHNob3VsZCBiZSBtYXRjaGVkIHVzaW5nIGEgY2FzZSBpbnNlbnNpdGl2ZVxuICAgKiBhbGdvcml0aG0uIERlZmF1bHRzIHRvIGBmYWxzZWAuXG4gICAqL1xuICB0aGlzLmNhc2VJbnNlbnNpdGl2ZU1hdGNoID0gZmFsc2U7XG5cbiAgIC8qKlxuICAgICogQHBhcmFtIHBhdGgge3N0cmluZ30gcGF0aFxuICAgICogQHBhcmFtIG9wdHMge09iamVjdH0gb3B0aW9uc1xuICAgICogQHJldHVybiB7P09iamVjdH1cbiAgICAqXG4gICAgKiBAZGVzY3JpcHRpb25cbiAgICAqIE5vcm1hbGl6ZXMgdGhlIGdpdmVuIHBhdGgsIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICogYW5kIHRoZSBvcmlnaW5hbCBwYXRoLlxuICAgICpcbiAgICAqIEluc3BpcmVkIGJ5IHBhdGhSZXhwIGluIHZpc2lvbm1lZGlhL2V4cHJlc3MvbGliL3V0aWxzLmpzLlxuICAgICovXG4gIGZ1bmN0aW9uIHBhdGhSZWdFeHAocGF0aCwgb3B0cykge1xuICAgIHZhciBpbnNlbnNpdGl2ZSA9IG9wdHMuY2FzZUluc2Vuc2l0aXZlTWF0Y2gsXG4gICAgICAgIHJldCA9IHtcbiAgICAgICAgICBvcmlnaW5hbFBhdGg6IHBhdGgsXG4gICAgICAgICAgcmVnZXhwOiBwYXRoXG4gICAgICAgIH0sXG4gICAgICAgIGtleXMgPSByZXQua2V5cyA9IFtdO1xuXG4gICAgcGF0aCA9IHBhdGhcbiAgICAgIC5yZXBsYWNlKC8oWygpLl0pL2csICdcXFxcJDEnKVxuICAgICAgLnJlcGxhY2UoLyhcXC8pPzooXFx3KykoXFwqXFw/fFtcXD9cXCpdKT8vZywgZnVuY3Rpb24oXywgc2xhc2gsIGtleSwgb3B0aW9uKSB7XG4gICAgICAgIHZhciBvcHRpb25hbCA9IChvcHRpb24gPT09ICc/JyB8fCBvcHRpb24gPT09ICcqPycpID8gJz8nIDogbnVsbDtcbiAgICAgICAgdmFyIHN0YXIgPSAob3B0aW9uID09PSAnKicgfHwgb3B0aW9uID09PSAnKj8nKSA/ICcqJyA6IG51bGw7XG4gICAgICAgIGtleXMucHVzaCh7IG5hbWU6IGtleSwgb3B0aW9uYWw6ICEhb3B0aW9uYWwgfSk7XG4gICAgICAgIHNsYXNoID0gc2xhc2ggfHwgJyc7XG4gICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gJycgOiBzbGFzaClcbiAgICAgICAgICArICcoPzonXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyBzbGFzaCA6ICcnKVxuICAgICAgICAgICsgKHN0YXIgJiYgJyguKz8pJyB8fCAnKFteL10rKScpXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpXG4gICAgICAgICAgKyAnKSdcbiAgICAgICAgICArIChvcHRpb25hbCB8fCAnJyk7XG4gICAgICB9KVxuICAgICAgLnJlcGxhY2UoLyhbXFwvJFxcKl0pL2csICdcXFxcJDEnKTtcblxuICAgIHJldC5yZWdleHAgPSBuZXcgUmVnRXhwKCdeJyArIHBhdGggKyAnJCcsIGluc2Vuc2l0aXZlID8gJ2knIDogJycpO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm91dGVQcm92aWRlciNvdGhlcndpc2VcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgcm91dGUgZGVmaW5pdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCBvbiByb3V0ZSBjaGFuZ2Ugd2hlbiBubyBvdGhlciByb3V0ZSBkZWZpbml0aW9uXG4gICAqIGlzIG1hdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gcGFyYW1zIE1hcHBpbmcgaW5mb3JtYXRpb24gdG8gYmUgYXNzaWduZWQgdG8gYCRyb3V0ZS5jdXJyZW50YC5cbiAgICogSWYgY2FsbGVkIHdpdGggYSBzdHJpbmcsIHRoZSB2YWx1ZSBtYXBzIHRvIGByZWRpcmVjdFRvYC5cbiAgICogQHJldHVybnMge09iamVjdH0gc2VsZlxuICAgKi9cbiAgdGhpcy5vdGhlcndpc2UgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBhcmFtcyA9IHtyZWRpcmVjdFRvOiBwYXJhbXN9O1xuICAgIH1cbiAgICB0aGlzLndoZW4obnVsbCwgcGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIHRoaXMuJGdldCA9IFsnJHJvb3RTY29wZScsXG4gICAgICAgICAgICAgICAnJGxvY2F0aW9uJyxcbiAgICAgICAgICAgICAgICckcm91dGVQYXJhbXMnLFxuICAgICAgICAgICAgICAgJyRxJyxcbiAgICAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgICAgJyR0ZW1wbGF0ZVJlcXVlc3QnLFxuICAgICAgICAgICAgICAgJyRzY2UnLFxuICAgICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsICRxLCAkaW5qZWN0b3IsICR0ZW1wbGF0ZVJlcXVlc3QsICRzY2UpIHtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBzZXJ2aWNlXG4gICAgICogQG5hbWUgJHJvdXRlXG4gICAgICogQHJlcXVpcmVzICRsb2NhdGlvblxuICAgICAqIEByZXF1aXJlcyAkcm91dGVQYXJhbXNcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjdXJyZW50IFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqIFRoZSByb3V0ZSBkZWZpbml0aW9uIGNvbnRhaW5zOlxuICAgICAqXG4gICAgICogICAtIGBjb250cm9sbGVyYDogVGhlIGNvbnRyb2xsZXIgY29uc3RydWN0b3IgYXMgZGVmaW5lZCBpbiB0aGUgcm91dGUgZGVmaW5pdGlvbi5cbiAgICAgKiAgIC0gYGxvY2Fsc2A6IEEgbWFwIG9mIGxvY2FscyB3aGljaCBpcyB1c2VkIGJ5IHtAbGluayBuZy4kY29udHJvbGxlciAkY29udHJvbGxlcn0gc2VydmljZSBmb3JcbiAgICAgKiAgICAgY29udHJvbGxlciBpbnN0YW50aWF0aW9uLiBUaGUgYGxvY2Fsc2AgY29udGFpblxuICAgICAqICAgICB0aGUgcmVzb2x2ZWQgdmFsdWVzIG9mIHRoZSBgcmVzb2x2ZWAgbWFwLiBBZGRpdGlvbmFsbHkgdGhlIGBsb2NhbHNgIGFsc28gY29udGFpbjpcbiAgICAgKlxuICAgICAqICAgICAtIGAkc2NvcGVgIC0gVGhlIGN1cnJlbnQgcm91dGUgc2NvcGUuXG4gICAgICogICAgIC0gYCR0ZW1wbGF0ZWAgLSBUaGUgY3VycmVudCByb3V0ZSB0ZW1wbGF0ZSBIVE1MLlxuICAgICAqXG4gICAgICogICAgIFRoZSBgbG9jYWxzYCB3aWxsIGJlIGFzc2lnbmVkIHRvIHRoZSByb3V0ZSBzY29wZSdzIGAkcmVzb2x2ZWAgcHJvcGVydHkuIFlvdSBjYW4gb3ZlcnJpZGVcbiAgICAgKiAgICAgdGhlIHByb3BlcnR5IG5hbWUsIHVzaW5nIGByZXNvbHZlQXNgIGluIHRoZSByb3V0ZSBkZWZpbml0aW9uLiBTZWVcbiAgICAgKiAgICAge0BsaW5rIG5nUm91dGUuJHJvdXRlUHJvdmlkZXIgJHJvdXRlUHJvdmlkZXJ9IGZvciBtb3JlIGluZm8uXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gcm91dGVzIE9iamVjdCB3aXRoIGFsbCByb3V0ZSBjb25maWd1cmF0aW9uIE9iamVjdHMgYXMgaXRzIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBgJHJvdXRlYCBpcyB1c2VkIGZvciBkZWVwLWxpbmtpbmcgVVJMcyB0byBjb250cm9sbGVycyBhbmQgdmlld3MgKEhUTUwgcGFydGlhbHMpLlxuICAgICAqIEl0IHdhdGNoZXMgYCRsb2NhdGlvbi51cmwoKWAgYW5kIHRyaWVzIHRvIG1hcCB0aGUgcGF0aCB0byBhbiBleGlzdGluZyByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqXG4gICAgICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAgICAgKlxuICAgICAqIFlvdSBjYW4gZGVmaW5lIHJvdXRlcyB0aHJvdWdoIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVByb3ZpZGVyICRyb3V0ZVByb3ZpZGVyfSdzIEFQSS5cbiAgICAgKlxuICAgICAqIFRoZSBgJHJvdXRlYCBzZXJ2aWNlIGlzIHR5cGljYWxseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlXG4gICAgICoge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBgbmdWaWV3YH0gZGlyZWN0aXZlIGFuZCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS4kcm91dGVQYXJhbXMgYCRyb3V0ZVBhcmFtc2B9IHNlcnZpY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFRoaXMgZXhhbXBsZSBzaG93cyBob3cgY2hhbmdpbmcgdGhlIFVSTCBoYXNoIGNhdXNlcyB0aGUgYCRyb3V0ZWAgdG8gbWF0Y2ggYSByb3V0ZSBhZ2FpbnN0IHRoZVxuICAgICAqIFVSTCwgYW5kIHRoZSBgbmdWaWV3YCBwdWxscyBpbiB0aGUgcGFydGlhbC5cbiAgICAgKlxuICAgICAqIDxleGFtcGxlIG5hbWU9XCIkcm91dGUtc2VydmljZVwiIG1vZHVsZT1cIm5nUm91dGVFeGFtcGxlXCJcbiAgICAgKiAgICAgICAgICBkZXBzPVwiYW5ndWxhci1yb3V0ZS5qc1wiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICogICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAqICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ29udHJvbGxlclwiPlxuICAgICAqICAgICAgIENob29zZTpcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5XCI+TW9ieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnkvY2gvMVwiPk1vYnk6IENoMTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieVwiPkdhdHNieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieS9jaC80P2tleT12YWx1ZVwiPkdhdHNieTogQ2g0PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svU2NhcmxldFwiPlNjYXJsZXQgTGV0dGVyPC9hPjxici8+XG4gICAgICpcbiAgICAgKiAgICAgICA8ZGl2IG5nLXZpZXc+PC9kaXY+XG4gICAgICpcbiAgICAgKiAgICAgICA8aHIgLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7JGxvY2F0aW9uLnBhdGgoKX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybCA9IHt7JHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmx9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQucGFyYW1zID0ge3skcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZSA9IHt7JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGVQYXJhbXMgPSB7eyRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICogICAgIDwvZGl2PlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICogICAgIGNvbnRyb2xsZXI6IHt7bmFtZX19PGJyIC8+XG4gICAgICogICAgIEJvb2sgSWQ6IHt7cGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgICAgQ2hhcHRlciBJZDoge3twYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInNjcmlwdC5qc1wiPlxuICAgICAqICAgICBhbmd1bGFyLm1vZHVsZSgnbmdSb3V0ZUV4YW1wbGUnLCBbJ25nUm91dGUnXSlcbiAgICAgKlxuICAgICAqICAgICAgLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAqICAgICAgICAgICRzY29wZS4kcm91dGVQYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQm9va0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJCb29rQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQ2hhcHRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJDaGFwdGVyQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgIC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICogICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgKiAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQnLCB7XG4gICAgICogICAgICAgICB0ZW1wbGF0ZVVybDogJ2Jvb2suaHRtbCcsXG4gICAgICogICAgICAgICBjb250cm9sbGVyOiAnQm9va0NvbnRyb2xsZXInLFxuICAgICAqICAgICAgICAgcmVzb2x2ZToge1xuICAgICAqICAgICAgICAgICAvLyBJIHdpbGwgY2F1c2UgYSAxIHNlY29uZCBkZWxheVxuICAgICAqICAgICAgICAgICBkZWxheTogZnVuY3Rpb24oJHEsICR0aW1lb3V0KSB7XG4gICAgICogICAgICAgICAgICAgdmFyIGRlbGF5ID0gJHEuZGVmZXIoKTtcbiAgICAgKiAgICAgICAgICAgICAkdGltZW91dChkZWxheS5yZXNvbHZlLCAxMDAwKTtcbiAgICAgKiAgICAgICAgICAgICByZXR1cm4gZGVsYXkucHJvbWlzZTtcbiAgICAgKiAgICAgICAgICAgfVxuICAgICAqICAgICAgICAgfVxuICAgICAqICAgICAgIH0pXG4gICAgICogICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQvY2gvOmNoYXB0ZXJJZCcsIHtcbiAgICAgKiAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhcHRlci5odG1sJyxcbiAgICAgKiAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGFwdGVyQ29udHJvbGxlcidcbiAgICAgKiAgICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgICAgIC8vIGNvbmZpZ3VyZSBodG1sNSB0byBnZXQgbGlua3Mgd29ya2luZyBvbiBqc2ZpZGRsZVxuICAgICAqICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICpcbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInByb3RyYWN0b3IuanNcIiB0eXBlPVwicHJvdHJhY3RvclwiPlxuICAgICAqICAgICBpdCgnc2hvdWxkIGxvYWQgYW5kIGNvbXBpbGUgY29ycmVjdCB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAqICAgICAgIGVsZW1lbnQoYnkubGlua1RleHQoJ01vYnk6IENoMScpKS5jbGljaygpO1xuICAgICAqICAgICAgIHZhciBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQ2hhcHRlckNvbnRyb2xsZXIvKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBNb2J5Lyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0NoYXB0ZXIgSWRcXDogMS8pO1xuICAgICAqXG4gICAgICogICAgICAgZWxlbWVudChieS5wYXJ0aWFsTGlua1RleHQoJ1NjYXJsZXQnKSkuY2xpY2soKTtcbiAgICAgKlxuICAgICAqICAgICAgIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBCb29rQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IFNjYXJsZXQvKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICogICA8L2ZpbGU+XG4gICAgICogPC9leGFtcGxlPlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN0YXJ0XG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGJlZm9yZSBhIHJvdXRlIGNoYW5nZS4gQXQgdGhpcyAgcG9pbnQgdGhlIHJvdXRlIHNlcnZpY2VzIHN0YXJ0c1xuICAgICAqIHJlc29sdmluZyBhbGwgb2YgdGhlIGRlcGVuZGVuY2llcyBuZWVkZWQgZm9yIHRoZSByb3V0ZSBjaGFuZ2UgdG8gb2NjdXIuXG4gICAgICogVHlwaWNhbGx5IHRoaXMgaW52b2x2ZXMgZmV0Y2hpbmcgdGhlIHZpZXcgdGVtcGxhdGUgYXMgd2VsbCBhcyBhbnkgZGVwZW5kZW5jaWVzXG4gICAgICogZGVmaW5lZCBpbiBgcmVzb2x2ZWAgcm91dGUgcHJvcGVydHkuIE9uY2UgIGFsbCBvZiB0aGUgZGVwZW5kZW5jaWVzIGFyZSByZXNvbHZlZFxuICAgICAqIGAkcm91dGVDaGFuZ2VTdWNjZXNzYCBpcyBmaXJlZC5cbiAgICAgKlxuICAgICAqIFRoZSByb3V0ZSBjaGFuZ2UgKGFuZCB0aGUgYCRsb2NhdGlvbmAgY2hhbmdlIHRoYXQgdHJpZ2dlcmVkIGl0KSBjYW4gYmUgcHJldmVudGVkXG4gICAgICogYnkgY2FsbGluZyBgcHJldmVudERlZmF1bHRgIG1ldGhvZCBvZiB0aGUgZXZlbnQuIFNlZSB7QGxpbmsgbmcuJHJvb3RTY29wZS5TY29wZSMkb259XG4gICAgICogZm9yIG1vcmUgZGV0YWlscyBhYm91dCBldmVudCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gbmV4dCBGdXR1cmUgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN1Y2Nlc3NcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgYWZ0ZXIgYSByb3V0ZSBjaGFuZ2UgaGFzIGhhcHBlbmVkIHN1Y2Nlc3NmdWxseS5cbiAgICAgKiBUaGUgYHJlc29sdmVgIGRlcGVuZGVuY2llcyBhcmUgbm93IGF2YWlsYWJsZSBpbiB0aGUgYGN1cnJlbnQubG9jYWxzYCBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqIHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fSBsaXN0ZW5zIGZvciB0aGUgZGlyZWN0aXZlXG4gICAgICogdG8gaW5zdGFudGlhdGUgdGhlIGNvbnRyb2xsZXIgYW5kIHJlbmRlciB0aGUgdmlldy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZXxVbmRlZmluZWR9IHByZXZpb3VzIFByZXZpb3VzIHJvdXRlIGluZm9ybWF0aW9uLCBvciB1bmRlZmluZWQgaWYgY3VycmVudCBpc1xuICAgICAqIGZpcnN0IHJvdXRlIGVudGVyZWQuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlRXJyb3JcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgaWYgYW55IG9mIHRoZSByZXNvbHZlIHByb21pc2VzIGFyZSByZWplY3RlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdFxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBwcmV2aW91cyBQcmV2aW91cyByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSByZWplY3Rpb24gUmVqZWN0aW9uIG9mIHRoZSBwcm9taXNlLiBVc3VhbGx5IHRoZSBlcnJvciBvZiB0aGUgZmFpbGVkIHByb21pc2UuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlVXBkYXRlXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSBgcmVsb2FkT25TZWFyY2hgIHByb3BlcnR5IGhhcyBiZWVuIHNldCB0byBmYWxzZSwgYW5kIHdlIGFyZSByZXVzaW5nIHRoZSBzYW1lXG4gICAgICogaW5zdGFuY2Ugb2YgdGhlIENvbnRyb2xsZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQvcHJldmlvdXMgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICovXG5cbiAgICB2YXIgZm9yY2VSZWxvYWQgPSBmYWxzZSxcbiAgICAgICAgcHJlcGFyZWRSb3V0ZSxcbiAgICAgICAgcHJlcGFyZWRSb3V0ZUlzVXBkYXRlT25seSxcbiAgICAgICAgJHJvdXRlID0ge1xuICAgICAgICAgIHJvdXRlczogcm91dGVzLFxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAqIEBuYW1lICRyb3V0ZSNyZWxvYWRcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAqIENhdXNlcyBgJHJvdXRlYCBzZXJ2aWNlIHRvIHJlbG9hZCB0aGUgY3VycmVudCByb3V0ZSBldmVuIGlmXG4gICAgICAgICAgICoge0BsaW5rIG5nLiRsb2NhdGlvbiAkbG9jYXRpb259IGhhc24ndCBjaGFuZ2VkLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogQXMgYSByZXN1bHQgb2YgdGhhdCwge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9XG4gICAgICAgICAgICogY3JlYXRlcyBuZXcgc2NvcGUgYW5kIHJlaW5zdGFudGlhdGVzIHRoZSBjb250cm9sbGVyLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3JjZVJlbG9hZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBmYWtlTG9jYXRpb25FdmVudCA9IHtcbiAgICAgICAgICAgICAgZGVmYXVsdFByZXZlbnRlZDogZmFsc2UsXG4gICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbiBmYWtlUHJldmVudERlZmF1bHQoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3JjZVJlbG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRldmFsQXN5bmMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByZXBhcmVSb3V0ZShmYWtlTG9jYXRpb25FdmVudCk7XG4gICAgICAgICAgICAgIGlmICghZmFrZUxvY2F0aW9uRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgY29tbWl0Um91dGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICogQG5hbWUgJHJvdXRlI3VwZGF0ZVBhcmFtc1xuICAgICAgICAgICAqXG4gICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICogQ2F1c2VzIGAkcm91dGVgIHNlcnZpY2UgdG8gdXBkYXRlIHRoZSBjdXJyZW50IFVSTCwgcmVwbGFjaW5nXG4gICAgICAgICAgICogY3VycmVudCByb3V0ZSBwYXJhbWV0ZXJzIHdpdGggdGhvc2Ugc3BlY2lmaWVkIGluIGBuZXdQYXJhbXNgLlxuICAgICAgICAgICAqIFByb3ZpZGVkIHByb3BlcnR5IG5hbWVzIHRoYXQgbWF0Y2ggdGhlIHJvdXRlJ3MgcGF0aCBzZWdtZW50XG4gICAgICAgICAgICogZGVmaW5pdGlvbnMgd2lsbCBiZSBpbnRlcnBvbGF0ZWQgaW50byB0aGUgbG9jYXRpb24ncyBwYXRoLCB3aGlsZVxuICAgICAgICAgICAqIHJlbWFpbmluZyBwcm9wZXJ0aWVzIHdpbGwgYmUgdHJlYXRlZCBhcyBxdWVyeSBwYXJhbXMuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAcGFyYW0geyFPYmplY3Q8c3RyaW5nLCBzdHJpbmc+fSBuZXdQYXJhbXMgbWFwcGluZyBvZiBVUkwgcGFyYW1ldGVyIG5hbWVzIHRvIHZhbHVlc1xuICAgICAgICAgICAqL1xuICAgICAgICAgIHVwZGF0ZVBhcmFtczogZnVuY3Rpb24obmV3UGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50ICYmIHRoaXMuY3VycmVudC4kJHJvdXRlKSB7XG4gICAgICAgICAgICAgIG5ld1BhcmFtcyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmN1cnJlbnQucGFyYW1zLCBuZXdQYXJhbXMpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChpbnRlcnBvbGF0ZSh0aGlzLmN1cnJlbnQuJCRyb3V0ZS5vcmlnaW5hbFBhdGgsIG5ld1BhcmFtcykpO1xuICAgICAgICAgICAgICAvLyBpbnRlcnBvbGF0ZSBtb2RpZmllcyBuZXdQYXJhbXMsIG9ubHkgcXVlcnkgcGFyYW1zIGFyZSBsZWZ0XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2gobmV3UGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93ICRyb3V0ZU1pbkVycignbm9yb3V0JywgJ1RyaWVkIHVwZGF0aW5nIHJvdXRlIHdoZW4gd2l0aCBubyBjdXJyZW50IHJvdXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgcHJlcGFyZVJvdXRlKTtcbiAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGNvbW1pdFJvdXRlKTtcblxuICAgIHJldHVybiAkcm91dGU7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9uIHtzdHJpbmd9IGN1cnJlbnQgdXJsXG4gICAgICogQHBhcmFtIHJvdXRlIHtPYmplY3R9IHJvdXRlIHJlZ2V4cCB0byBtYXRjaCB0aGUgdXJsIGFnYWluc3RcbiAgICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ2hlY2sgaWYgdGhlIHJvdXRlIG1hdGNoZXMgdGhlIGN1cnJlbnQgdXJsLlxuICAgICAqXG4gICAgICogSW5zcGlyZWQgYnkgbWF0Y2ggaW5cbiAgICAgKiB2aXNpb25tZWRpYS9leHByZXNzL2xpYi9yb3V0ZXIvcm91dGVyLmpzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN3aXRjaFJvdXRlTWF0Y2hlcihvbiwgcm91dGUpIHtcbiAgICAgIHZhciBrZXlzID0gcm91dGUua2V5cyxcbiAgICAgICAgICBwYXJhbXMgPSB7fTtcblxuICAgICAgaWYgKCFyb3V0ZS5yZWdleHApIHJldHVybiBudWxsO1xuXG4gICAgICB2YXIgbSA9IHJvdXRlLnJlZ2V4cC5leGVjKG9uKTtcbiAgICAgIGlmICghbSkgcmV0dXJuIG51bGw7XG5cbiAgICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBtLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcblxuICAgICAgICB2YXIgdmFsID0gbVtpXTtcblxuICAgICAgICBpZiAoa2V5ICYmIHZhbCkge1xuICAgICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcGFyZVJvdXRlKCRsb2NhdGlvbkV2ZW50KSB7XG4gICAgICB2YXIgbGFzdFJvdXRlID0gJHJvdXRlLmN1cnJlbnQ7XG5cbiAgICAgIHByZXBhcmVkUm91dGUgPSBwYXJzZVJvdXRlKCk7XG4gICAgICBwcmVwYXJlZFJvdXRlSXNVcGRhdGVPbmx5ID0gcHJlcGFyZWRSb3V0ZSAmJiBsYXN0Um91dGUgJiYgcHJlcGFyZWRSb3V0ZS4kJHJvdXRlID09PSBsYXN0Um91dGUuJCRyb3V0ZVxuICAgICAgICAgICYmIGFuZ3VsYXIuZXF1YWxzKHByZXBhcmVkUm91dGUucGF0aFBhcmFtcywgbGFzdFJvdXRlLnBhdGhQYXJhbXMpXG4gICAgICAgICAgJiYgIXByZXBhcmVkUm91dGUucmVsb2FkT25TZWFyY2ggJiYgIWZvcmNlUmVsb2FkO1xuXG4gICAgICBpZiAoIXByZXBhcmVkUm91dGVJc1VwZGF0ZU9ubHkgJiYgKGxhc3RSb3V0ZSB8fCBwcmVwYXJlZFJvdXRlKSkge1xuICAgICAgICBpZiAoJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdGFydCcsIHByZXBhcmVkUm91dGUsIGxhc3RSb3V0ZSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgIGlmICgkbG9jYXRpb25FdmVudCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21taXRSb3V0ZSgpIHtcbiAgICAgIHZhciBsYXN0Um91dGUgPSAkcm91dGUuY3VycmVudDtcbiAgICAgIHZhciBuZXh0Um91dGUgPSBwcmVwYXJlZFJvdXRlO1xuXG4gICAgICBpZiAocHJlcGFyZWRSb3V0ZUlzVXBkYXRlT25seSkge1xuICAgICAgICBsYXN0Um91dGUucGFyYW1zID0gbmV4dFJvdXRlLnBhcmFtcztcbiAgICAgICAgYW5ndWxhci5jb3B5KGxhc3RSb3V0ZS5wYXJhbXMsICRyb3V0ZVBhcmFtcyk7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlVXBkYXRlJywgbGFzdFJvdXRlKTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dFJvdXRlIHx8IGxhc3RSb3V0ZSkge1xuICAgICAgICBmb3JjZVJlbG9hZCA9IGZhbHNlO1xuICAgICAgICAkcm91dGUuY3VycmVudCA9IG5leHRSb3V0ZTtcbiAgICAgICAgaWYgKG5leHRSb3V0ZSkge1xuICAgICAgICAgIGlmIChuZXh0Um91dGUucmVkaXJlY3RUbykge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobmV4dFJvdXRlLnJlZGlyZWN0VG8pKSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKGludGVycG9sYXRlKG5leHRSb3V0ZS5yZWRpcmVjdFRvLCBuZXh0Um91dGUucGFyYW1zKSkuc2VhcmNoKG5leHRSb3V0ZS5wYXJhbXMpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkbG9jYXRpb24udXJsKG5leHRSb3V0ZS5yZWRpcmVjdFRvKG5leHRSb3V0ZS5wYXRoUGFyYW1zLCAkbG9jYXRpb24ucGF0aCgpLCAkbG9jYXRpb24uc2VhcmNoKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRxLndoZW4obmV4dFJvdXRlKS5cbiAgICAgICAgICB0aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKG5leHRSb3V0ZSkge1xuICAgICAgICAgICAgICB2YXIgbG9jYWxzID0gYW5ndWxhci5leHRlbmQoe30sIG5leHRSb3V0ZS5yZXNvbHZlKSxcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLCB0ZW1wbGF0ZVVybDtcblxuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobG9jYWxzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxzW2tleV0gPSBhbmd1bGFyLmlzU3RyaW5nKHZhbHVlKSA/XG4gICAgICAgICAgICAgICAgICAgICRpbmplY3Rvci5nZXQodmFsdWUpIDogJGluamVjdG9yLmludm9rZSh2YWx1ZSwgbnVsbCwgbnVsbCwga2V5KTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlID0gbmV4dFJvdXRlLnRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlKG5leHRSb3V0ZS5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZVVybCA9IG5leHRSb3V0ZS50ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgPSB0ZW1wbGF0ZVVybChuZXh0Um91dGUucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgICAgICAgICAgbmV4dFJvdXRlLmxvYWRlZFRlbXBsYXRlVXJsID0gJHNjZS52YWx1ZU9mKHRlbXBsYXRlVXJsKTtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gJHRlbXBsYXRlUmVxdWVzdCh0ZW1wbGF0ZVVybCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbHNbJyR0ZW1wbGF0ZSddID0gdGVtcGxhdGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbChsb2NhbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLlxuICAgICAgICAgIHRoZW4oZnVuY3Rpb24obG9jYWxzKSB7XG4gICAgICAgICAgICAvLyBhZnRlciByb3V0ZSBjaGFuZ2VcbiAgICAgICAgICAgIGlmIChuZXh0Um91dGUgPT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgaWYgKG5leHRSb3V0ZSkge1xuICAgICAgICAgICAgICAgIG5leHRSb3V0ZS5sb2NhbHMgPSBsb2NhbHM7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KG5leHRSb3V0ZS5wYXJhbXMsICRyb3V0ZVBhcmFtcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdWNjZXNzJywgbmV4dFJvdXRlLCBsYXN0Um91dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAobmV4dFJvdXRlID09ICRyb3V0ZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlRXJyb3InLCBuZXh0Um91dGUsIGxhc3RSb3V0ZSwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge09iamVjdH0gdGhlIGN1cnJlbnQgYWN0aXZlIHJvdXRlLCBieSBtYXRjaGluZyBpdCBhZ2FpbnN0IHRoZSBVUkxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZVJvdXRlKCkge1xuICAgICAgLy8gTWF0Y2ggYSByb3V0ZVxuICAgICAgdmFyIHBhcmFtcywgbWF0Y2g7XG4gICAgICBhbmd1bGFyLmZvckVhY2gocm91dGVzLCBmdW5jdGlvbihyb3V0ZSwgcGF0aCkge1xuICAgICAgICBpZiAoIW1hdGNoICYmIChwYXJhbXMgPSBzd2l0Y2hSb3V0ZU1hdGNoZXIoJGxvY2F0aW9uLnBhdGgoKSwgcm91dGUpKSkge1xuICAgICAgICAgIG1hdGNoID0gaW5oZXJpdChyb3V0ZSwge1xuICAgICAgICAgICAgcGFyYW1zOiBhbmd1bGFyLmV4dGVuZCh7fSwgJGxvY2F0aW9uLnNlYXJjaCgpLCBwYXJhbXMpLFxuICAgICAgICAgICAgcGF0aFBhcmFtczogcGFyYW1zfSk7XG4gICAgICAgICAgbWF0Y2guJCRyb3V0ZSA9IHJvdXRlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIE5vIHJvdXRlIG1hdGNoZWQ7IGZhbGxiYWNrIHRvIFwib3RoZXJ3aXNlXCIgcm91dGVcbiAgICAgIHJldHVybiBtYXRjaCB8fCByb3V0ZXNbbnVsbF0gJiYgaW5oZXJpdChyb3V0ZXNbbnVsbF0sIHtwYXJhbXM6IHt9LCBwYXRoUGFyYW1zOnt9fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gaW50ZXJwb2xhdGlvbiBvZiB0aGUgcmVkaXJlY3QgcGF0aCB3aXRoIHRoZSBwYXJhbWV0ZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW50ZXJwb2xhdGUoc3RyaW5nLCBwYXJhbXMpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCgoc3RyaW5nIHx8ICcnKS5zcGxpdCgnOicpLCBmdW5jdGlvbihzZWdtZW50LCBpKSB7XG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc2VnbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNlZ21lbnRNYXRjaCA9IHNlZ21lbnQubWF0Y2goLyhcXHcrKSg/Ols/Kl0pPyguKikvKTtcbiAgICAgICAgICB2YXIga2V5ID0gc2VnbWVudE1hdGNoWzFdO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHBhcmFtc1trZXldKTtcbiAgICAgICAgICByZXN1bHQucHVzaChzZWdtZW50TWF0Y2hbMl0gfHwgJycpO1xuICAgICAgICAgIGRlbGV0ZSBwYXJhbXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgIH1cbiAgfV07XG59XG5cbm5nUm91dGVNb2R1bGUucHJvdmlkZXIoJyRyb3V0ZVBhcmFtcycsICRSb3V0ZVBhcmFtc1Byb3ZpZGVyKTtcblxuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkcm91dGVQYXJhbXNcbiAqIEByZXF1aXJlcyAkcm91dGVcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSBgJHJvdXRlUGFyYW1zYCBzZXJ2aWNlIGFsbG93cyB5b3UgdG8gcmV0cmlldmUgdGhlIGN1cnJlbnQgc2V0IG9mIHJvdXRlIHBhcmFtZXRlcnMuXG4gKlxuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqXG4gKiBUaGUgcm91dGUgcGFyYW1ldGVycyBhcmUgYSBjb21iaW5hdGlvbiBvZiB7QGxpbmsgbmcuJGxvY2F0aW9uIGAkbG9jYXRpb25gfSdzXG4gKiB7QGxpbmsgbmcuJGxvY2F0aW9uI3NlYXJjaCBgc2VhcmNoKClgfSBhbmQge0BsaW5rIG5nLiRsb2NhdGlvbiNwYXRoIGBwYXRoKClgfS5cbiAqIFRoZSBgcGF0aGAgcGFyYW1ldGVycyBhcmUgZXh0cmFjdGVkIHdoZW4gdGhlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSBgJHJvdXRlYH0gcGF0aCBpcyBtYXRjaGVkLlxuICpcbiAqIEluIGNhc2Ugb2YgcGFyYW1ldGVyIG5hbWUgY29sbGlzaW9uLCBgcGF0aGAgcGFyYW1zIHRha2UgcHJlY2VkZW5jZSBvdmVyIGBzZWFyY2hgIHBhcmFtcy5cbiAqXG4gKiBUaGUgc2VydmljZSBndWFyYW50ZWVzIHRoYXQgdGhlIGlkZW50aXR5IG9mIHRoZSBgJHJvdXRlUGFyYW1zYCBvYmplY3Qgd2lsbCByZW1haW4gdW5jaGFuZ2VkXG4gKiAoYnV0IGl0cyBwcm9wZXJ0aWVzIHdpbGwgbGlrZWx5IGNoYW5nZSkgZXZlbiB3aGVuIGEgcm91dGUgY2hhbmdlIG9jY3Vycy5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIGAkcm91dGVQYXJhbXNgIGFyZSBvbmx5IHVwZGF0ZWQgKmFmdGVyKiBhIHJvdXRlIGNoYW5nZSBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LlxuICogVGhpcyBtZWFucyB0aGF0IHlvdSBjYW5ub3QgcmVseSBvbiBgJHJvdXRlUGFyYW1zYCBiZWluZyBjb3JyZWN0IGluIHJvdXRlIHJlc29sdmUgZnVuY3Rpb25zLlxuICogSW5zdGVhZCB5b3UgY2FuIHVzZSBgJHJvdXRlLmN1cnJlbnQucGFyYW1zYCB0byBhY2Nlc3MgdGhlIG5ldyByb3V0ZSdzIHBhcmFtZXRlcnMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiAgLy8gR2l2ZW46XG4gKiAgLy8gVVJMOiBodHRwOi8vc2VydmVyLmNvbS9pbmRleC5odG1sIy9DaGFwdGVyLzEvU2VjdGlvbi8yP3NlYXJjaD1tb2J5XG4gKiAgLy8gUm91dGU6IC9DaGFwdGVyLzpjaGFwdGVySWQvU2VjdGlvbi86c2VjdGlvbklkXG4gKiAgLy9cbiAqICAvLyBUaGVuXG4gKiAgJHJvdXRlUGFyYW1zID09PiB7Y2hhcHRlcklkOicxJywgc2VjdGlvbklkOicyJywgc2VhcmNoOidtb2J5J31cbiAqIGBgYFxuICovXG5mdW5jdGlvbiAkUm91dGVQYXJhbXNQcm92aWRlcigpIHtcbiAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB7fTsgfTtcbn1cblxubmdSb3V0ZU1vZHVsZS5kaXJlY3RpdmUoJ25nVmlldycsIG5nVmlld0ZhY3RvcnkpO1xubmdSb3V0ZU1vZHVsZS5kaXJlY3RpdmUoJ25nVmlldycsIG5nVmlld0ZpbGxDb250ZW50RmFjdG9yeSk7XG5cblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSBuZ1ZpZXdcbiAqIEByZXN0cmljdCBFQ0FcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqICMgT3ZlcnZpZXdcbiAqIGBuZ1ZpZXdgIGlzIGEgZGlyZWN0aXZlIHRoYXQgY29tcGxlbWVudHMgdGhlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSAkcm91dGV9IHNlcnZpY2UgYnlcbiAqIGluY2x1ZGluZyB0aGUgcmVuZGVyZWQgdGVtcGxhdGUgb2YgdGhlIGN1cnJlbnQgcm91dGUgaW50byB0aGUgbWFpbiBsYXlvdXQgKGBpbmRleC5odG1sYCkgZmlsZS5cbiAqIEV2ZXJ5IHRpbWUgdGhlIGN1cnJlbnQgcm91dGUgY2hhbmdlcywgdGhlIGluY2x1ZGVkIHZpZXcgY2hhbmdlcyB3aXRoIGl0IGFjY29yZGluZyB0byB0aGVcbiAqIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGAkcm91dGVgIHNlcnZpY2UuXG4gKlxuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqXG4gKiBAYW5pbWF0aW9uc1xuICogfCBBbmltYXRpb24gICAgICAgICAgICAgICAgICAgICAgICB8IE9jY3VycyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18XG4gKiB8IHtAbGluayBuZy4kYW5pbWF0ZSNlbnRlciBlbnRlcn0gIHwgd2hlbiB0aGUgbmV3IGVsZW1lbnQgaXMgaW5zZXJ0ZWQgdG8gdGhlIERPTSB8XG4gKiB8IHtAbGluayBuZy4kYW5pbWF0ZSNsZWF2ZSBsZWF2ZX0gIHwgd2hlbiB0aGUgb2xkIGVsZW1lbnQgaXMgcmVtb3ZlZCBmcm9tIHRvIHRoZSBET00gIHxcbiAqXG4gKiBUaGUgZW50ZXIgYW5kIGxlYXZlIGFuaW1hdGlvbiBvY2N1ciBjb25jdXJyZW50bHkuXG4gKlxuICogQGtub3duSXNzdWUgSWYgYG5nVmlld2AgaXMgY29udGFpbmVkIGluIGFuIGFzeW5jaHJvbm91c2x5IGxvYWRlZCB0ZW1wbGF0ZSAoZS5nLiBpbiBhbm90aGVyXG4gKiAgICAgICAgICAgICBkaXJlY3RpdmUncyB0ZW1wbGF0ZVVybCBvciBpbiBhIHRlbXBsYXRlIGxvYWRlZCB1c2luZyBgbmdJbmNsdWRlYCksIHRoZW4geW91IG5lZWQgdG9cbiAqICAgICAgICAgICAgIG1ha2Ugc3VyZSB0aGF0IGAkcm91dGVgIGlzIGluc3RhbnRpYXRlZCBpbiB0aW1lIHRvIGNhcHR1cmUgdGhlIGluaXRpYWxcbiAqICAgICAgICAgICAgIGAkbG9jYXRpb25DaGFuZ2VTdGFydGAgZXZlbnQgYW5kIGxvYWQgdGhlIGFwcHJvcHJpYXRlIHZpZXcuIE9uZSB3YXkgdG8gYWNoaWV2ZSB0aGlzXG4gKiAgICAgICAgICAgICBpcyB0byBoYXZlIGl0IGFzIGEgZGVwZW5kZW5jeSBpbiBhIGAucnVuYCBibG9jazpcbiAqICAgICAgICAgICAgIGBteU1vZHVsZS5ydW4oWyckcm91dGUnLCBmdW5jdGlvbigpIHt9XSk7YFxuICpcbiAqIEBzY29wZVxuICogQHByaW9yaXR5IDQwMFxuICogQHBhcmFtIHtzdHJpbmc9fSBvbmxvYWQgRXhwcmVzc2lvbiB0byBldmFsdWF0ZSB3aGVuZXZlciB0aGUgdmlldyB1cGRhdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gYXV0b3Njcm9sbCBXaGV0aGVyIGBuZ1ZpZXdgIHNob3VsZCBjYWxsIHtAbGluayBuZy4kYW5jaG9yU2Nyb2xsXG4gKiAgICAgICAgICAgICAgICAgICRhbmNob3JTY3JvbGx9IHRvIHNjcm9sbCB0aGUgdmlld3BvcnQgYWZ0ZXIgdGhlIHZpZXcgaXMgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAgICAgICAgICAgIC0gSWYgdGhlIGF0dHJpYnV0ZSBpcyBub3Qgc2V0LCBkaXNhYmxlIHNjcm9sbGluZy5cbiAqICAgICAgICAgICAgICAgICAgLSBJZiB0aGUgYXR0cmlidXRlIGlzIHNldCB3aXRob3V0IHZhbHVlLCBlbmFibGUgc2Nyb2xsaW5nLlxuICogICAgICAgICAgICAgICAgICAtIE90aGVyd2lzZSBlbmFibGUgc2Nyb2xsaW5nIG9ubHkgaWYgdGhlIGBhdXRvc2Nyb2xsYCBhdHRyaWJ1dGUgdmFsdWUgZXZhbHVhdGVkXG4gKiAgICAgICAgICAgICAgICAgICAgYXMgYW4gZXhwcmVzc2lvbiB5aWVsZHMgYSB0cnV0aHkgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICAgIDxleGFtcGxlIG5hbWU9XCJuZ1ZpZXctZGlyZWN0aXZlXCIgbW9kdWxlPVwibmdWaWV3RXhhbXBsZVwiXG4gICAgICAgICAgICAgZGVwcz1cImFuZ3VsYXItcm91dGUuanM7YW5ndWxhci1hbmltYXRlLmpzXCJcbiAgICAgICAgICAgICBhbmltYXRpb25zPVwidHJ1ZVwiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ3RybCBhcyBtYWluXCI+XG4gICAgICAgICAgQ2hvb3NlOlxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnlcIj5Nb2J5PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieS9jaC8xXCI+TW9ieTogQ2gxPC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5XCI+R2F0c2J5PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5L2NoLzQ/a2V5PXZhbHVlXCI+R2F0c2J5OiBDaDQ8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9TY2FybGV0XCI+U2NhcmxldCBMZXR0ZXI8L2E+PGJyLz5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aWV3LWFuaW1hdGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IG5nLXZpZXcgY2xhc3M9XCJ2aWV3LWFuaW1hdGVcIj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aHIgLz5cblxuICAgICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7bWFpbi4kbG9jYXRpb24ucGF0aCgpfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsID0ge3ttYWluLiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnBhcmFtcyA9IHt7bWFpbi4kcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlUGFyYW1zID0ge3ttYWluLiRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgY29udHJvbGxlcjoge3tib29rLm5hbWV9fTxiciAvPlxuICAgICAgICAgIEJvb2sgSWQ6IHt7Ym9vay5wYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBjb250cm9sbGVyOiB7e2NoYXB0ZXIubmFtZX19PGJyIC8+XG4gICAgICAgICAgQm9vayBJZDoge3tjaGFwdGVyLnBhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAgICAgIENoYXB0ZXIgSWQ6IHt7Y2hhcHRlci5wYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJhbmltYXRpb25zLmNzc1wiPlxuICAgICAgICAudmlldy1hbmltYXRlLWNvbnRhaW5lciB7XG4gICAgICAgICAgcG9zaXRpb246cmVsYXRpdmU7XG4gICAgICAgICAgaGVpZ2h0OjEwMHB4IWltcG9ydGFudDtcbiAgICAgICAgICBiYWNrZ3JvdW5kOndoaXRlO1xuICAgICAgICAgIGJvcmRlcjoxcHggc29saWQgYmxhY2s7XG4gICAgICAgICAgaGVpZ2h0OjQwcHg7XG4gICAgICAgICAgb3ZlcmZsb3c6aGlkZGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZSB7XG4gICAgICAgICAgcGFkZGluZzoxMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlciwgLnZpZXctYW5pbWF0ZS5uZy1sZWF2ZSB7XG4gICAgICAgICAgdHJhbnNpdGlvbjphbGwgY3ViaWMtYmV6aWVyKDAuMjUwLCAwLjQ2MCwgMC40NTAsIDAuOTQwKSAxLjVzO1xuXG4gICAgICAgICAgZGlzcGxheTpibG9jaztcbiAgICAgICAgICB3aWR0aDoxMDAlO1xuICAgICAgICAgIGJvcmRlci1sZWZ0OjFweCBzb2xpZCBibGFjaztcblxuICAgICAgICAgIHBvc2l0aW9uOmFic29sdXRlO1xuICAgICAgICAgIHRvcDowO1xuICAgICAgICAgIGxlZnQ6MDtcbiAgICAgICAgICByaWdodDowO1xuICAgICAgICAgIGJvdHRvbTowO1xuICAgICAgICAgIHBhZGRpbmc6MTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIge1xuICAgICAgICAgIGxlZnQ6MTAwJTtcbiAgICAgICAgfVxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyLm5nLWVudGVyLWFjdGl2ZSB7XG4gICAgICAgICAgbGVmdDowO1xuICAgICAgICB9XG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctbGVhdmUubmctbGVhdmUtYWN0aXZlIHtcbiAgICAgICAgICBsZWZ0Oi0xMDAlO1xuICAgICAgICB9XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJzY3JpcHQuanNcIj5cbiAgICAgICAgYW5ndWxhci5tb2R1bGUoJ25nVmlld0V4YW1wbGUnLCBbJ25nUm91dGUnLCAnbmdBbmltYXRlJ10pXG4gICAgICAgICAgLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvQm9vay86Ym9va0lkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdib29rLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2snXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZC9jaC86Y2hhcHRlcklkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGFwdGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoYXB0ZXJDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NoYXB0ZXInXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdNYWluQ3RybCcsIFsnJHJvdXRlJywgJyRyb3V0ZVBhcmFtcycsICckbG9jYXRpb24nLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHJvdXRlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgICB0aGlzLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgICAgICAgICAgdGhpcy4kbG9jYXRpb24gPSAkbG9jYXRpb247XG4gICAgICAgICAgICAgIHRoaXMuJHJvdXRlUGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdCb29rQ3RybCcsIFsnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24oJHJvdXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBcIkJvb2tDdHJsXCI7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignQ2hhcHRlckN0cmwnLCBbJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uKCRyb3V0ZVBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gXCJDaGFwdGVyQ3RybFwiO1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pO1xuXG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJwcm90cmFjdG9yLmpzXCIgdHlwZT1cInByb3RyYWN0b3JcIj5cbiAgICAgICAgaXQoJ3Nob3VsZCBsb2FkIGFuZCBjb21waWxlIGNvcnJlY3QgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBlbGVtZW50KGJ5LmxpbmtUZXh0KCdNb2J5OiBDaDEnKSkuY2xpY2soKTtcbiAgICAgICAgICB2YXIgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyXFw6IENoYXB0ZXJDdHJsLyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWRcXDogTW9ieS8pO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9DaGFwdGVyIElkXFw6IDEvKTtcblxuICAgICAgICAgIGVsZW1lbnQoYnkucGFydGlhbExpbmtUZXh0KCdTY2FybGV0JykpLmNsaWNrKCk7XG5cbiAgICAgICAgICBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQm9va0N0cmwvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBTY2FybGV0Lyk7XG4gICAgICAgIH0pO1xuICAgICAgPC9maWxlPlxuICAgIDwvZXhhbXBsZT5cbiAqL1xuXG5cbi8qKlxuICogQG5nZG9jIGV2ZW50XG4gKiBAbmFtZSBuZ1ZpZXcjJHZpZXdDb250ZW50TG9hZGVkXG4gKiBAZXZlbnRUeXBlIGVtaXQgb24gdGhlIGN1cnJlbnQgbmdWaWV3IHNjb3BlXG4gKiBAZGVzY3JpcHRpb25cbiAqIEVtaXR0ZWQgZXZlcnkgdGltZSB0aGUgbmdWaWV3IGNvbnRlbnQgaXMgcmVsb2FkZWQuXG4gKi9cbm5nVmlld0ZhY3RvcnkuJGluamVjdCA9IFsnJHJvdXRlJywgJyRhbmNob3JTY3JvbGwnLCAnJGFuaW1hdGUnXTtcbmZ1bmN0aW9uIG5nVmlld0ZhY3RvcnkoJHJvdXRlLCAkYW5jaG9yU2Nyb2xsLCAkYW5pbWF0ZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUNBJyxcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICBwcmlvcml0eTogNDAwLFxuICAgIHRyYW5zY2x1ZGU6ICdlbGVtZW50JyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgJGVsZW1lbnQsIGF0dHIsIGN0cmwsICR0cmFuc2NsdWRlKSB7XG4gICAgICAgIHZhciBjdXJyZW50U2NvcGUsXG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCxcbiAgICAgICAgICAgIHByZXZpb3VzTGVhdmVBbmltYXRpb24sXG4gICAgICAgICAgICBhdXRvU2Nyb2xsRXhwID0gYXR0ci5hdXRvc2Nyb2xsLFxuICAgICAgICAgICAgb25sb2FkRXhwID0gYXR0ci5vbmxvYWQgfHwgJyc7XG5cbiAgICAgICAgc2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdWNjZXNzJywgdXBkYXRlKTtcbiAgICAgICAgdXBkYXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gY2xlYW51cExhc3RWaWV3KCkge1xuICAgICAgICAgIGlmIChwcmV2aW91c0xlYXZlQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5jYW5jZWwocHJldmlvdXNMZWF2ZUFuaW1hdGlvbik7XG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY3VycmVudFNjb3BlKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgcHJldmlvdXNMZWF2ZUFuaW1hdGlvbiA9ICRhbmltYXRlLmxlYXZlKGN1cnJlbnRFbGVtZW50KTtcbiAgICAgICAgICAgIHByZXZpb3VzTGVhdmVBbmltYXRpb24udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcHJldmlvdXNMZWF2ZUFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgICAgdmFyIGxvY2FscyA9ICRyb3V0ZS5jdXJyZW50ICYmICRyb3V0ZS5jdXJyZW50LmxvY2FscyxcbiAgICAgICAgICAgICAgdGVtcGxhdGUgPSBsb2NhbHMgJiYgbG9jYWxzLiR0ZW1wbGF0ZTtcblxuICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIHZhciBuZXdTY29wZSA9IHNjb3BlLiRuZXcoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJHJvdXRlLmN1cnJlbnQ7XG5cbiAgICAgICAgICAgIC8vIE5vdGU6IFRoaXMgd2lsbCBhbHNvIGxpbmsgYWxsIGNoaWxkcmVuIG9mIG5nLXZpZXcgdGhhdCB3ZXJlIGNvbnRhaW5lZCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgIC8vIGh0bWwuIElmIHRoYXQgY29udGVudCBjb250YWlucyBjb250cm9sbGVycywgLi4uIHRoZXkgY291bGQgcG9sbHV0ZS9jaGFuZ2UgdGhlIHNjb3BlLlxuICAgICAgICAgICAgLy8gSG93ZXZlciwgdXNpbmcgbmctdmlldyBvbiBhbiBlbGVtZW50IHdpdGggYWRkaXRpb25hbCBjb250ZW50IGRvZXMgbm90IG1ha2Ugc2Vuc2UuLi5cbiAgICAgICAgICAgIC8vIE5vdGU6IFdlIGNhbid0IHJlbW92ZSB0aGVtIGluIHRoZSBjbG9uZUF0dGNoRm4gb2YgJHRyYW5zY2x1ZGUgYXMgdGhhdFxuICAgICAgICAgICAgLy8gZnVuY3Rpb24gaXMgY2FsbGVkIGJlZm9yZSBsaW5raW5nIHRoZSBjb250ZW50LCB3aGljaCB3b3VsZCBhcHBseSBjaGlsZFxuICAgICAgICAgICAgLy8gZGlyZWN0aXZlcyB0byBub24gZXhpc3RpbmcgZWxlbWVudHMuXG4gICAgICAgICAgICB2YXIgY2xvbmUgPSAkdHJhbnNjbHVkZShuZXdTY29wZSwgZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgICAgICAgJGFuaW1hdGUuZW50ZXIoY2xvbmUsIG51bGwsIGN1cnJlbnRFbGVtZW50IHx8ICRlbGVtZW50KS50aGVuKGZ1bmN0aW9uIG9uTmdWaWV3RW50ZXIoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGF1dG9TY3JvbGxFeHApXG4gICAgICAgICAgICAgICAgICAmJiAoIWF1dG9TY3JvbGxFeHAgfHwgc2NvcGUuJGV2YWwoYXV0b1Njcm9sbEV4cCkpKSB7XG4gICAgICAgICAgICAgICAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY2xlYW51cExhc3RWaWV3KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY3VycmVudEVsZW1lbnQgPSBjbG9uZTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZSA9IGN1cnJlbnQuc2NvcGUgPSBuZXdTY29wZTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZW1pdCgnJHZpZXdDb250ZW50TG9hZGVkJyk7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGV2YWwob25sb2FkRXhwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xlYW51cExhc3RWaWV3KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9O1xufVxuXG4vLyBUaGlzIGRpcmVjdGl2ZSBpcyBjYWxsZWQgZHVyaW5nIHRoZSAkdHJhbnNjbHVkZSBjYWxsIG9mIHRoZSBmaXJzdCBgbmdWaWV3YCBkaXJlY3RpdmUuXG4vLyBJdCB3aWxsIHJlcGxhY2UgYW5kIGNvbXBpbGUgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2l0aCB0aGUgbG9hZGVkIHRlbXBsYXRlLlxuLy8gV2UgbmVlZCB0aGlzIGRpcmVjdGl2ZSBzbyB0aGF0IHRoZSBlbGVtZW50IGNvbnRlbnQgaXMgYWxyZWFkeSBmaWxsZWQgd2hlblxuLy8gdGhlIGxpbmsgZnVuY3Rpb24gb2YgYW5vdGhlciBkaXJlY3RpdmUgb24gdGhlIHNhbWUgZWxlbWVudCBhcyBuZ1ZpZXdcbi8vIGlzIGNhbGxlZC5cbm5nVmlld0ZpbGxDb250ZW50RmFjdG9yeS4kaW5qZWN0ID0gWyckY29tcGlsZScsICckY29udHJvbGxlcicsICckcm91dGUnXTtcbmZ1bmN0aW9uIG5nVmlld0ZpbGxDb250ZW50RmFjdG9yeSgkY29tcGlsZSwgJGNvbnRyb2xsZXIsICRyb3V0ZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUNBJyxcbiAgICBwcmlvcml0eTogLTQwMCxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gJHJvdXRlLmN1cnJlbnQsXG4gICAgICAgICAgbG9jYWxzID0gY3VycmVudC5sb2NhbHM7XG5cbiAgICAgICRlbGVtZW50Lmh0bWwobG9jYWxzLiR0ZW1wbGF0ZSk7XG5cbiAgICAgIHZhciBsaW5rID0gJGNvbXBpbGUoJGVsZW1lbnQuY29udGVudHMoKSk7XG5cbiAgICAgIGlmIChjdXJyZW50LmNvbnRyb2xsZXIpIHtcbiAgICAgICAgbG9jYWxzLiRzY29wZSA9IHNjb3BlO1xuICAgICAgICB2YXIgY29udHJvbGxlciA9ICRjb250cm9sbGVyKGN1cnJlbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgaWYgKGN1cnJlbnQuY29udHJvbGxlckFzKSB7XG4gICAgICAgICAgc2NvcGVbY3VycmVudC5jb250cm9sbGVyQXNdID0gY29udHJvbGxlcjtcbiAgICAgICAgfVxuICAgICAgICAkZWxlbWVudC5kYXRhKCckbmdDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXIpO1xuICAgICAgICAkZWxlbWVudC5jaGlsZHJlbigpLmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICB9XG4gICAgICBzY29wZVtjdXJyZW50LnJlc29sdmVBcyB8fCAnJHJlc29sdmUnXSA9IGxvY2FscztcblxuICAgICAgbGluayhzY29wZSk7XG4gICAgfVxuICB9O1xufVxuXG5cbn0pKHdpbmRvdywgd2luZG93LmFuZ3VsYXIpO1xuIl19
