var zwengelServices = angular.module('zwengelServices', ['ngResource']);

var services_zwengel = {};

services_zwengel.AllData = function(){
    this.page = {
        title: "Tijdlijn"
    };
    
    this.doel = {};
    
    this.step = {};
    
    this.pref = {
        doelscreen: "list"
    };
    
    return {
        page: this.page,
        doel: this.doel,
        step: this.step,
        pref: this.pref
    }
};

zwengelServices.factory('AllData', services_zwengel.AllData);