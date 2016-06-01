var zwengelServices = angular.module('zwengelServices', ['ngResource']);

var services_zwengel = {};

services_zwengel.AllData = function(){
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
        //console.log(self.history);
    };
    
    self.page = {
        title: "Login",
        url: "#/login"
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
            if(historyItem.title !="Login"){
                self.to(historyItem.title, historyItem.url, historyItem.doel, historyItem.step);
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

zwengelServices.factory('AllData', services_zwengel.AllData);