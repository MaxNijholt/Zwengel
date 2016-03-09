var zwengelServices = angular.module('zwengelServices', ['ngResource']);

var services_zwengel = {};

services_zwengel.AllData = function(){
    this.page = {
        title: "Tijdlijn",
        url: "#/tijdlijn"
    };
    
    this.doel = {};
    
    this.step = {};
    
    this.pref = {
        doelscreen: "list"
    };
    
    this.history = [];
    
    this.pushHistory = function(title, url, doel, step){
        var object = {
            title: title,
            url: url,
            doel: doel,
            step: step
        };
        
        this.history.push(object);
    };
    
    return {
        page: this.page,
        doel: this.doel,
        step: this.step,
        pref: this.pref,
        history: this.history,
        pushHistory: this.pushHistory
    }
};

zwengelServices.factory('AllData', services_zwengel.AllData);