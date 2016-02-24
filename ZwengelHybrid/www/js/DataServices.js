var dataServices = angular.module('dataServices', ['ngResource']);

var services_data = {};
var dataCaller = {};

services_data.StudentInfo = function(){
    this.getModules = function(studentID, onSucces){
        dataCaller.getModules(studentID, onSucces);
    };
    
    this.getBeloningen = function(studentID, onSucces){
        dataCaller.getBeloningen(studentID, onSucces);
    };
    
    return {
        getModules: this.getModules,
        getBeloningen: this.getBeloningen
    };
};

dataCaller.getModules = function(studentID, onSucces){
    var testResult = [{
			"title": "Minder praten tijdens de les",
			"endDate": "05-03-2016",
            "image": "ion-volume-low",
			"steps": [
				{
					"title": "4x2 min",
					"description": "4 keer 2 min in de les niks zeggen",
					"endDate": "10-02-2016"
				},
				{
					"title": "4x3 min",
					"description": "4 keer 3 min in de les niks zeggen.",
					"endDate": "12-02-2016"
				},
				{
					"title": "2x5 min",
					"description": "2 keer moet in de les 5 minuten lang niks gezegd worden.",
					"endDate": "17-02-2016"
				},
				{
					"title": "2x7 min",
					"description": "De student moet in de les 7 minuten lang niks zeggen. Dit moet tijdens een les 2 keer gedaan worden.",
					"endDate": "25-02-2016"
				},
				{
					"title": "1x10 min",
					"description": "1 keer stil zijn 10 minuten lang.",
					"endDate": "29-02-2016"
				},
				{
					"title": "1x15 min",
					"description": "De student moet een kwartier lang stil zijn tijdens de les.",
					"endDate": "05-03-2016"
				}
            ]
		},
        {
			"title": "De rekentafels kennen",
			"endDate": "04-05-2016",
            "image": "ion-calculator",
			"steps": [
				{
					"title": "Tafels 1, 2 en 3",
					"description": "De leerling moet de tafel van 1, 2 en 3 uit zijn hoofd kennen.",
					"endDate": "21-02-2016"
				},
				{
					"title": "Tafels 4 en 5",
					"description": "De leerling moet de tafels van 1 tot en met 5 uit zijn hoofd kennen.",
					"endDate": "02-03-2016"
				},
				{
					"title": "Tafels 6 en 7",
					"description": "De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
					"endDate": "29-03-2016"
				},
				{
					"title": "Tafels 8 en 9",
					"description": "Tafels 8 en 9 zijn erg moeilijk en moeten ook geleerd worden. De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
					"endDate": "21-04-2016"
				},
				{
					"title": "Tafel van 10",
					"description": "10 is vrij makkelijk. Deze moet ook geleerd worden.",
					"endDate": "04-05-2016"
				}
            ]
		}
    ];
    
    onSucces(testResult);
};

dataCaller.getBeloningen = function(studentID, onSucces){
    var testResult = [{ 
        "title": "10 min. spelletje spelen in de les",
        "behaald": true
    },{ 
        "title": "15 min. spelletje spelen in de les",
        "behaald": false
    },{ 
        "title": "Thema Ridder",
        "behaald": false
    },{ 
        "title": "Thema Koning",
        "behaald": true
    },{ 
        "title": "Als eerste naar huis",
        "behaald": false
    }
    ];
    
    onSucces(testResult);
};

dataServices.factory('StudentInfo', services_data.StudentInfo);