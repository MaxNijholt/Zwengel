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