app.factory("socket", ["socketFactory", "localStorageService", function(socketFactory, localStorageService){
	//var myIoSocket = io.connect('http://newagesme.com:8080/');        
	var session = JSON.parse(localStorageService.get('user'));   
	var isLoggedin = JSON.parse(localStorageService.get('isLoggedin')); 
	//console.log("isssssssssss",isLoggedin);
	if (isLoggedin == true) {	   
		var myIoSocket = io.connect('http://10.10.10.67:7071', { query: "member_id=" + session.member_id });
	}else{
		var myIoSocket = io.connect('https://newagesme.com:7071');
	}
	mySocket = socketFactory({
		ioSocket: myIoSocket
	});
	
	return mySocket;
}]);