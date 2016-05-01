var app = {
    
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
	    ionic.Platform.fullScreen();
        angular.bootstrap(document, ['zwengelApp']);
    }
};

app.initialize();