var zwengelServices = angular.module('zwengelServices', ['ngResource']);

var services_zwengel = {};

services_zwengel.AllData = function(){
    this.page = {
        title: "Tijdlijn"
    }
    
    this.doel = {};
    
    return {
        page: this.page,
        doel: this.doel
    }
};

zwengelServices.factory('AllData', services_zwengel.AllData);