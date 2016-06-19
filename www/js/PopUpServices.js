var popUpServices = angular.module('popUpServices', []);

PopUps = function($ionicPopup){
    var self = this;
    
    self.editMotivation = function(scope, onSucces){
        $ionicPopup.show({
            templateUrl: 'views/editMotivation.html',
            title: 'Motivatie aanpassen',
            subTitle: 'Gebruik een nummer van 1 tot en met 5',
            scope: scope,
            buttons: [
                { text: 'Annuleren' },
                {
                    text: '<b>Opslaan</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (scope.popupData.motivation > 0 && scope.popupData.motivation < 6) {
                            onSucces(scope.popupData.motivation);
                        } else {
                            e.preventDefault();
                        }
                    }
                }
            ]
        });
	};
	
	return {
        editMotivation: self.editMotivation
	};
};

popUpServices.factory('PopUps', ['$ionicPopup', PopUps]);