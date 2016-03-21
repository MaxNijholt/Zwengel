var dataServices = angular.module('dataServices', ['ngResource']);

var services_data = {};
var dataCaller = {};

services_data.StudentInfo = function(){
    var self = this;
    
    self.getDoelen = function(studentID, onSucces){
        dataCaller.getDoelen(studentID, onSucces);
    };
    
    self.getDoel = function(studentID, doelID, onSucces){
        dataCaller.getDoel(studentID, doelID, onSucces);
    };
    
    self.getStap = function(studentID, doelID, stapID, onSucces){
        dataCaller.getStap(studentID, doelID, stapID, onSucces);
    };
    
    self.getBeloningen = function(studentID, onSucces){
        dataCaller.getBeloningen(studentID, onSucces);
    };
    
    return {
        getDoelen: self.getDoelen,
        getDoel: self.getDoel,
        getStap: self.getStap,
        getBeloningen: self.getBeloningen
    };
};

dataCaller.testResult = [
		{
			"id": "t1",
			"title": "Minder praten tijdens de les",
			"description": "De student kan zich langere tijd stil houden in de les. Hierbij is het doel om 15 minuten lang niks te zeggen",
			"icon": "ion-volume-low",
			"startDate": "29-01-2016",
			"endDate": "05-03-2016",
			"steps": [
				{
					"id": "st1",
					"title": "4x2 min",
					"description": "4 keer 2 min in de les niks zeggen",
					"endDate": "10-02-2016"
				},
				{
					"id": "st2",
					"title": "4x3 min",
					"description": "4 keer 3 min in de les niks zeggen.",
					"endDate": "12-02-2016"
				},
				{
					"id": "st3",
					"title": "2x5 min",
					"description": "2 keer moet in de les 5 minuten lang niks gezegd worden.",
					"endDate": "17-02-2016"
				},
				{
					"id": "st4",
					"title": "2x7 min",
					"description": "De student moet in de les 7 minuten lang niks zeggen. Dit moet tijdens een les 2 keer gedaan worden.",
					"endDate": "25-02-2016"
				},
				{
					"id": "st5",
					"title": "1x10 min",
					"description": "1 keer stil zijn 10 minuten lang.",
					"endDate": "29-02-2016"
				},
				{
					"id": "st6",
					"title": "1x15 min",
					"description": "De student moet een kwartier lang stil zijn tijdens de les.",
					"endDate": "05-03-2016"
				}
			]
		},
		{
			"id": "t2",
			"title": "De rekentafels kennen",
			"description": "De student kent de tafels van 1 tot en met 10 uit zijn hoofd.",
			"icon": "ion-calculator",
			"startDate": "01-01-2016",
			"endDate": "04-05-2016",
			"steps": [
				{
					"id": "st7",
					"title": "Tafels 1, 2 en 3",
					"description": "De leerling moet de tafel van 1, 2 en 3 uit zijn hoofd kennen.",
					"endDate": "21-02-2016"
				},
				{
					"id": "st8",
					"title": "Tafels 4 en 5",
					"description": "De leerling moet de tafels van 1 tot en met 5 uit zijn hoofd kennen.",
					"endDate": "02-03-2016"
				},
				{
					"id": "st9",
					"title": "Tafels 6 en 7",
					"description": "De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
					"endDate": "29-03-2016"
				},
				{
					"id": "st10",
					"title": "Tafels 8 en 9",
					"description": "Tafels 8 en 9 zijn erg moeilijk en moeten ook geleerd worden. De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
					"endDate": "21-04-2016"
				},
				{
					"id": "st11",
					"title": "Tafel van 10",
					"description": "10 is vrij makkelijk. Deze moet ook geleerd worden.",
					"endDate": "04-05-2016"
				}
			]
		},
		{
			"id": "t3",
			"title": "Planning nakomen",
			"description": "De student kan de planning nakomen die hem aan het begin van de maand gegeven is, nakomen.",
			"icon": "ion-calendar",
			"endDate": "31-01-2016",
			"startDate": "01-07-2015",
			"steps": [
				{
					"id": "st12",
					"title": "4 van de 10 taken",
					"description": "Aan het eind van de maand moeten 4 van de 10 taken af zijn.",
					"endDate": "31-07-2015"
				},
				{
					"id": "st13",
					"title": "5 van de 10 taken",
					"description": "De helft van de taken moet aan het eind van de maand af zijn.",
					"endDate": "31-08-2015"
				},
				{
					"id": "st14",
					"title": "6 van de 10 taken",
					"description": "6 taken moeten aan het eind van de maand af zijn.",
					"endDate": "31-09-2015"
				},
				{
					"id": "st15",
					"title": "7 van de 10 taken",
					"description": "De student moet 7 taken van de 10 af hebben aan het einde van de maand.",
					"endDate": "31-10-2015"
				},
				{
					"id": "st16",
					"title": "8 van de 10 taken",
					"description": "Aan het einde van de maand moeten 8 taken af zijn.",
					"endDate": "31-11-2015"
				},
				{
					"id": "st17",
					"title": "9 van de 10 taken",
					"description": "9 van de 10 taken moeten zijn afgerond aan het einde van de maand.",
					"endDate": "31-12-2015"
				},
				{
					"id": "st18",
					"title": "10 van de 10 taken",
					"description": "De student moet zijn planning volledig hebben nagekomen.",
					"endDate": "31-01-2016"
				}
			]
		},
		{
			"id": "t4",
			"title": "Complimenten geven",
			"description": "De student moet dagelijks een compliment geven aan een medeleerling",
			"icon": "ion-android-contacts",
			"startDate": "19-11-2014",
			"endDate": "10-05-2015",
			"steps": [
				{
					"id": "st19",
					"title": "Eerste compliment",
					"description": "De leerling heeft een medestudent een compliment gegeven.",
					"endDate": "31-12-2014"
				},
				{
					"id": "st20",
					"title": "Complimenten voor 5 weken",
					"description": "De student heeft 5 weken lang elke week een compliment aan een medestudent gegeven.",
					"endDate": "12-03-2015"
				},
				{
					"id": "st21",
					"title": "12 complimenten in 4 weken",
					"description": "De leerling heeft 4 weken lang elke week 3 complimenten gegeven aan medestudenten.",
					"endDate": "29-05-2015"
				},
				{
					"id": "st22",
					"title": "21 complimenten in 3 weken",
					"description": "3 weken lang heeft de student elke dag een compliment gegeven aan een medestudent.",
					"endDate": "14-07-2015"
				}
			]
		},			
		{
			"id": "t5",
			"title": "Overtuigen",
			"description": "De student kan met een medestudent in discussie gaan en de ander van eigen mening overtuigen.",
			"icon": "ion-chatbubbles",
			"startDate": "02-02-2016",
			"endDate": "04-02-2016",
			"steps": [
				{
					"id": "st23",
					"title": "Vragen stellen",
					"description": "De student vraagt een medestudent om zijn mening.",
					"endDate": "02-02-2016"
				},
				{
					"id": "st24",
					"title": "Complimenten voor 5 weken",
					"description": "De student heeft 5 weken lang elke week een compliment aan een medestudent gegeven.",
					"endDate": "12-03-2015"
				},
				{
					"id": "st25",
					"title": "12 complimenten in 4 weken",
					"description": "De leerling heeft 4 weken lang elke week 3 complimenten gegeven aan medestudenten.",
					"endDate": "29-05-2015"
				},
				{
					"id": "st26",
					"title": "21 complimenten in 3 weken",
					"description": "3 weken lang heeft de student elke dag een compliment gegeven aan een medestudent.",
					"endDate": "14-07-2015"
				}
			]
		}
	];

dataCaller.getDoelen = function(studentID, onSucces){    
    onSucces(dataCaller.testResult);
};

dataCaller.getDoel = function(studentID, doelID, onSucces){
    var doel = null;
    
    dataCaller.testResult.forEach(function(object){
        if(object.id === doelID){
            doel = object;
        }
    });
    
    onSucces(doel);
};

dataCaller.getStap = function(studentID, doelID, stapID, onSucces){
    var stap = null;
    
    dataCaller.testResult.forEach(function(object){
        if(object.id === doelID){
            object.steps.forEach(function(object2){
               if(object2.id === stapID){
                   stap = object2;
               }
            });
        }
    });
    
    onSucces(stap);
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