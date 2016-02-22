var dataServices = angular.module('dataServices', ['ngResource']);

var services_data = {};
var dataCaller = {};

services_data.StudentInfo = function(){
    this.getModules = function(studentID, onSucces){
        dataCaller.getModules(studentID, onSucces);
    };
    
    return {
        getModules: this.getModules
    };
};

dataCaller.getModules = function(studentID, onSucces){
    var testResult = [{
			"title": "Minder praten tijdens de les",
			"endDate": "05-03-2016",
            "image": "ion-volume-low",
			"steps": {
				"Step1": {
					"title": "4x2 min",
					"Description": "4 keer 2 min in de les niks zeggen",
					"endDate": "10-02-2016"
				},
				"Step2": {
					"title": "4x3 min",
					"Description": "4 keer 3 min in de les niks zeggen.",
					"endDate": "12-02-2016"
				},
				"Step3": {
					"title": "2x5 min",
					"Description": "2 keer moet in de les 5 minuten lang niks gezegd worden.",
					"endDate": "17-02-2016"
				},
				"Step4": {
					"title": "2x7 min",
					"Description": "De student moet in de les 7 minuten lang niks zeggen. Dit moet tijdens een les 2 keer gedaan worden.",
					"endDate": "25-02-2016"
				},
				"Step5": {
					"title": "1x10 min",
					"Description": "1 keer stil zijn 10 minuten lang.",
					"endDate": "29-02-2016"
				},
				"Step6": {
					"title": "1x15 min",
					"Description": "De student moet een kwartier lang stil zijn tijdens de les.",
					"endDate": "05-03-2016"
				}
			}
		},
        {
			"title": "De rekentafels kennen",
			"endDate": "04-05-2016",
            "image": "ion-calculator",
			"steps": {
				"Step1": {
					"title": "Tafels 1, 2 en 3",
					"Description": "De leerling moet de tafel van 1, 2 en 3 uit zijn hoofd kennen.",
					"endDate": "21-02-2016"
				},
				"Step2": {
					"title": "Tafels 4 en 5",
					"Description": "De leerling moet de tafels van 1 tot en met 5 uit zijn hoofd kennen.",
					"endDate": "02-03-2016"
				},
				"Step3": {
					"title": "Tafels 6 en 7",
					"Description": "De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
					"endDate": "29-03-2016"
				},
				"Step4": {
					"title": "Tafels 8 en 9",
					"Description": "Tafels 8 en 9 zijn erg moeilijk en moeten ook geleerd worden. De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
					"endDate": "21-04-2016"
				},
				"Step5": {
					"title": "Tafel van 10",
					"Description": "10 is vrij makkelijk. Deze moet ook geleerd worden.",
					"endDate": "04-05-2016"
				}
			}
		}
    ];
    
    onSucces(testResult);
};

dataServices.factory('StudentInfo', services_data.StudentInfo);