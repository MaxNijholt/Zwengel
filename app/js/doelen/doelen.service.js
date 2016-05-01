module.exports = function($http) {
	var self = this;
    var dataCaller = {};
    
    dataCaller.testResult = [
        {
            "id": "t1",
            "title": "Overtuigen",
            "description": "De student kan met een medestudent in discussie gaan en de ander van eigen mening overtuigen.",
            "icon": "ion-chatbubbles",
            "done": "doing",
            "motivation": null,
            "startDate": "02-02-2016",
            "endDate": "04-08-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "Vragen stellen",
                    "description": "De student vraagt een medestudent om zijn mening.",
                    "done": "good",
                    "endDate": "02-02-2016"
                },
                {
                    "id": "st2",
                    "title": "Complimenten voor 5 weken",
                    "description": "De student heeft 5 weken lang elke week een compliment aan een medestudent gegeven.",
                    "done": "good",
                    "endDate": "12-03-2015"
                },
                {
                    "id": "st3",
                    "title": "12 complimenten in 4 weken",
                    "description": "De leerling heeft 4 weken lang elke week 3 complimenten gegeven aan medestudenten.",
                    "done": "doing",
                    "endDate": "29-05-2015"
                },
                {
                    "id": "st4",
                    "title": "21 complimenten in 3 weken",
                    "description": "3 weken lang heeft de student elke dag een compliment gegeven aan een medestudent.",
                    "done": "doing",
                    "endDate": "14-07-2015"
                }
            ]
        },
        {
            "id": "t2",
            "title": "De rekentafels kennen",
            "description": "De student kent de tafels van 1 tot en met 10 uit zijn hoofd.",
            "icon": "ion-calculator",
            "done": "doing",
            "motivation": null,
            "startDate": "01-01-2016",
            "endDate": "04-05-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "Tafels 1, 2 en 3",
                    "description": "De leerling moet de tafel van 1, 2 en 3 uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "21-02-2016"
                },
                {
                    "id": "st2",
                    "title": "Tafels 4 en 5",
                    "description": "De leerling moet de tafels van 1 tot en met 5 uit zijn hoofd kennen.",
                    "done": "bad",
                    "endDate": "02-03-2016"
                },
                {
                    "id": "st3",
                    "title": "Tafels 6 en 7",
                    "description": "De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
                    "done": "doing",
                    "endDate": "29-03-2016"
                },
                {
                    "id": "st4",
                    "title": "Tafels 8 en 9",
                    "description": "Tafels 8 en 9 zijn erg moeilijk en moeten ook geleerd worden. De leerling moet de tafels van 1 tot en met 7 uit zijn hoofd kennen.",
                    "done": "doing",
                    "endDate": "21-04-2016"
                },
                {
                    "id": "st5",
                    "title": "Tafel van 10",
                    "description": "10 is vrij makkelijk. Deze moet ook geleerd worden.",
                    "done": "doing",
                    "endDate": "04-05-2016"
                }
            ]
        },
        {
            "id": "t3",
            "title": "Het Wilhelmus kennen",
            "description": "De student kent het Wilhelmus uit zijn hoofd.",
            "icon": "ion-volume-high",
            "done": "doing",
            "motivation": null,
            "startDate": "01-02-2016",
            "endDate": "01-04-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "Eerste couplet",
                    "description": "De leerling kent het eerste couplet uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "15-02-2016"
                },
                {
                    "id": "st2",
                    "title": "Eerste refrein",
                    "description": "De leerling kent het eerste refrein uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "01-03-2016"
                },
                {
                    "id": "st3",
                    "title": "Tweede couplet",
                    "description": "De leerling kent het tweede couplet uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "11-03-2016"
                },
                {
                    "id": "st4",
                    "title": "Tweede refrein",
                    "description": "De leerling kent het tweede refrein uit zijn hoofd kennen.",
                    "done": "good",
                    "endDate": "22-03-2016"
                },
                {
                    "id": "st5",
                    "title": "Derde couplet",
                    "description": "De leerling kent het derde couplet uit zijn hoofd kennen.",
                    "done": "doing",
                    "endDate": "01-04-2016"
                }
            ]
        },
        {
            "id": "t4",
            "title": "Minder praten tijdens de les",
            "description": "De student kan zich langere tijd stil houden in de les. Hierbij is het doel om 15 minuten lang niks te zeggen",
            "icon": "ion-volume-low",
            "done": "good",
            "motivation": 4,
            "startDate": "29-01-2016",
            "endDate": "05-03-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "4x2 min",
                    "description": "4 keer 2 min in de les niks zeggen",
                    "done": "good",
                    "endDate": "10-02-2016"
                },
                {
                    "id": "st2",
                    "title": "4x3 min",
                    "description": "4 keer 3 min in de les niks zeggen.",
                    "done": "good",
                    "endDate": "12-02-2016"
                },
                {
                    "id": "st3",
                    "title": "2x5 min",
                    "description": "2 keer moet in de les 5 minuten lang niks gezegd worden.",
                    "done": "good",
                    "endDate": "17-02-2016"
                },
                {
                    "id": "st4",
                    "title": "2x7 min",
                    "description": "De student moet in de les 7 minuten lang niks zeggen. Dit moet tijdens een les 2 keer gedaan worden.",
                    "done": "good",
                    "endDate": "25-02-2016"
                },
                {
                    "id": "st5",
                    "title": "1x10 min",
                    "description": "1 keer stil zijn 10 minuten lang.",
                    "done": "good",
                    "endDate": "29-02-2016"
                },
                {
                    "id": "st6",
                    "title": "1x15 min",
                    "description": "De student moet een kwartier lang stil zijn tijdens de les.",
                    "done": "good",
                    "endDate": "05-03-2016"
                }
            ]
        },
        {
            "id": "t5",
            "title": "Planning nakomen",
            "description": "De student kan de planning nakomen die hem aan het begin van de maand gegeven is, nakomen.",
            "icon": "ion-calendar",
            "done": "bad",
            "motivation": 1,
            "startDate": "01-07-2015",
            "endDate": "31-01-2016",
            "steps": [
                {
                    "id": "st1",
                    "title": "4 van de 10 taken",
                    "description": "Aan het eind van de maand moeten 4 van de 10 taken af zijn.",
                    "done": "good",
                    "endDate": "31-07-2015"
                },
                {
                    "id": "st2",
                    "title": "5 van de 10 taken",
                    "description": "De helft van de taken moet aan het eind van de maand af zijn.",
                    "done": "bad",
                    "endDate": "31-08-2015"
                },
                {
                    "id": "st3",
                    "title": "6 van de 10 taken",
                    "description": "6 taken moeten aan het eind van de maand af zijn.",
                    "done": "bad",
                    "endDate": "31-09-2015"
                },
                {
                    "id": "st4",
                    "title": "7 van de 10 taken",
                    "description": "De student moet 7 taken van de 10 af hebben aan het einde van de maand.",
                    "done": "bad",
                    "endDate": "31-10-2015"
                },
                {
                    "id": "st5",
                    "title": "8 van de 10 taken",
                    "description": "Aan het einde van de maand moeten 8 taken af zijn.",
                    "done": "bad",
                    "endDate": "31-11-2015"
                },
                {
                    "id": "st6",
                    "title": "9 van de 10 taken",
                    "description": "9 van de 10 taken moeten zijn afgerond aan het einde van de maand.",
                    "done": "bad",
                    "endDate": "31-12-2015"
                },
                {
                    "id": "st7",
                    "title": "10 van de 10 taken",
                    "description": "De student moet zijn planning volledig hebben nagekomen.",
                    "done": "bad",
                    "endDate": "31-01-2016"
                }
            ]
        },
        {
            "id": "t6",
            "title": "Complimenten geven",
            "description": "De student moet dagelijks een compliment geven aan een medeleerling",
            "icon": "ion-android-contacts",
            "done": "good",
            "motivation": 5,
            "startDate": "19-11-2014",
            "endDate": "10-05-2015",
            "steps": [
                {
                    "id": "st1",
                    "title": "Eerste compliment",
                    "description": "De leerling heeft een medestudent een compliment gegeven.",
                    "done": "good",
                    "endDate": "31-12-2014"
                },
                {
                    "id": "st2",
                    "title": "Complimenten voor 5 weken",
                    "description": "De student heeft 5 weken lang elke week een compliment aan een medestudent gegeven.",
                    "done": "good",
                    "endDate": "12-03-2015"
                },
                {
                    "id": "st3",
                    "title": "12 complimenten in 4 weken",
                    "description": "De leerling heeft 4 weken lang elke week 3 complimenten gegeven aan medestudenten.",
                    "done": "good",
                    "endDate": "29-05-2015"
                },
                {
                    "id": "st4",
                    "title": "21 complimenten in 3 weken",
                    "description": "3 weken lang heeft de student elke dag een compliment gegeven aan een medestudent.",
                    "done": "good",
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
    
    self.getDoelen = function(studentID, onSucces){
        dataCaller.getDoelen(studentID, onSucces);
    };
    
    self.getDoel = function(studentID, doelID, onSucces){
        dataCaller.getDoel(studentID, doelID, onSucces);
    };
    
    self.getStap = function(studentID, doelID, stapID, onSucces){
        dataCaller.getStap(studentID, doelID, stapID, onSucces);
    };

	return {
        getDoelen: self.getDoelen,
        getDoel: self.getDoel,
        getStap: self.getStap
	};
};