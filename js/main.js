function $ (selector) {
	return document.querySelector(selector);
}

function all (selector) {
	return document.querySelectorAll(selector);
}

var updatePage= function (data) {
	updateNotification(data.notification);
	updateQuickActions(data.quickActions);

}


var updateNotification= function (data) {
	if (  data !== undefined) { 
		$(".notifications").innerHTML ="<p>"+ data +"</p>";
	}
}



var updateQuickActions= function (actions) {
var navSections = all(".nav-section");


	if (  actions !== undefined) { 
	for (var i = 0; i < actions.length; i++) {
		navSections[i].innerHTML = "<p>" + actions[i].label + "</p>" + navSections[i].innerHTML;
		navSections[i].style.background = "black url(./img/icons/" + actions[i].icon + ".png)  left 50% top 77px no-repeat";
	//	navSections[i].
	//	navSections[i].style.hover.background = "blue url(./img/icons/" + actions[i].icon + ".png)  left 50% top 77px no-repeat";
		}

var menuCaptions = all(".menu-caption");
	for (var i = 0; i < actions.length; i++) {
		menuCaptions[i].innerHTML = "<p>" + actions[i].actionsLabel + "</p>" ;
		}

	
	}
}


function initialize () {	
	UTILS.ajax("data/config.json",{done:updatePage,});
}

window.onLoad = initialize();