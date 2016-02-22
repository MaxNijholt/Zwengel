var zwengelServices = angular.module('zwengelServices', ['ngResource']);

var services_zwengel = {};

services_zwengel.AllData = function(){
    this.page = {
        title: "Tijdlijn"
    }
    
    return {
        page: this.page
    }
};

zwengelServices.factory('AllData', services_zwengel.AllData);