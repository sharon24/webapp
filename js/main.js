function $ (selector) {
	return document.querySelector(selector);
}

var updateNotification= function () {
	if (  arguments[0].notification !== undefined) { 
		$(".notifications").innerHTML ="<p>"+ arguments[0].notification +"</p>";
	}
}

function notificationLoad() {
	
	UTILS.ajax("data/config.json",{done:updateNotification});
}



function initialize () {	
	notificationLoad();
}

window.onLoad = initialize();