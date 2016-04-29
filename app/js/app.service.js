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