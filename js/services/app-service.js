app.factory("appSerivce", [ 'localStorageService', function(localStorageService){
    return{
        getLocalStore: function(){
            return {
                token: localStorageService.get('token'),
                isLoggedin: localStorageService.get('isLoggedin'),
                user: JSON.parse(localStorageService.get('user'))
            }
        },
        logout: function(){
            localStorageService.clearAll();
            localStorageService.set('isLoggedin', 'false');
            return;
        },
        showLoadingText: function($evt){
            $evt.target.innerHTML = "Please wait...";
            $evt.target.disabled = true;    
        },
        hideLoadingText: function($evt, text){
            $evt.target.innerHTML = text;
            $evt.target.disabled = false;
        }
    }
}])