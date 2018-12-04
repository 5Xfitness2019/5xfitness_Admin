app.factory('dialogService', ["$mdDialog", function($mdDialog){
    return{
        showAlert: function(ev, title, text){
            $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(text)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
            );
        },
        showConfirm: function(ev, title, text){
            var confirm = $mdDialog.confirm()
                .title(title)
                .textContent(text)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');
             return $mdDialog.show(confirm); 
            /*$mdDialog.show(confirm).then(function() {
            $scope.status = 'You decided to get rid of your debt.';
            }, function() {
            $scope.status = 'You decided to keep your debt.';
            });*/
        },
        showPrompt: function(ev, title, text, placeholder, initialVal){
            var confirm = $mdDialog.prompt()
            .title(title)
            .textContent(text)
            .placeholder(placeholder)
            .ariaLabel(placeholder)
            .initialValue(initialVal)
            .targetEvent(ev)
            .ok('Okay!')
            .cancel('I\'m a cat person');

            $mdDialog.show(confirm).then(function(result) {
            $scope.status = 'You decided to name your dog ' + result + '.';
            }, function() {
            $scope.status = 'You didn\'t name your dog.';
            });
        }
    }
}])