var zwengelServices = angular.module('zwengelServices', ['ngResource']);

var services_zwengel = {};

services_zwengel.AllData = function(){
    var self = this;
    
    function to(title, url, doel, step) {
        self.page.title = title;
        self.page.url = url;
        if(doel){
            self.page.doel = doel;
        }else{
            self.page.doel = null;
        }
        if(step){
            self.page.step = step;
        }else{
            self.page.step = null;
        }
        window.location.replace(url);
    }
    
    function pushHistory(){
        var object = {
            title: self.page.title,
            url: self.page.url,
            doel: self.page.doel,
            step: self.page.step
        };
        
        self.history.push(object);
        console.log(self.history);
    };
    
    self.page = {
        title: "Tijdlijn",
        url: "#/tijdlijn",
        doel: null,
        step: null
    };
    
    self.pref = {
        doelscreen: "list"
    };
    
    self.history = [];
    
    self.toPage = function(title, url, doel, step){
        pushHistory();
        to(title, url, doel, step);
    };
    
    self.toBack = function(){
        var historyItem = self.history.pop();
        to(historyItem.title, historyItem.url, historyItem.doel, historyItem.step)
    };
    
    return {
        page: self.page,
        pref: self.pref,
        history: self.history,
        pushHistory: self.pushHistory,
        toPage: self.toPage,
        toBack: self.toBack
    }
};

zwengelServices.factory('AllData', services_zwengel.AllData);