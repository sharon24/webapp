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



var updateQuickActions= function (quickActions) {
	var navSections = all(".nav-section");


	if (  quickActions !== undefined) { 
		for (var i = 0; i < quickActions.length; i++) {
			navSections[i].innerHTML = "<p>" + quickActions[i].label + "</p>" + navSections[i].innerHTML;
			navSections[i].style.background = "black url(./img/icons/" + quickActions[i].icon + ".png)  left 50% top 77px no-repeat";
		
		}

		var menuCaptions = all(".menu-caption");
		for (var i = 0; i < quickActions.length; i++) {
			menuCaptions[i].innerHTML = "<p>" + quickActions[i].actionsLabel + "</p>" ;
		}


		var g=4;
		var q=0;
		var actionLists = all(".action-list");
		for (var i = 0; i < quickActions.length; i++) {
			for (var j = 0; j <  quickActions[i].actions.length; j++) {
				actionLists[i].innerHTML += "<li><a tabindex=\""+g+"\" href=\"" + quickActions[i].actions[j].url + "\">" + quickActions[i].actions[j].label + "</a></li>"
				g++;

				 all(".action-list li >a")[q].addEventListener("focus",changeFocus,false);
				 q++;
				 console.log(q);
				//actionLists[i].addEventListener("focus",changeFocus,false);
			}
			g++;
		}

	}
	alert(all(".action-list li >a").length)


}

var updateTabs = function(iconList){
    var cls=iconList.preferences.fontPref.prefix;
    var tabs= all(".tabs ul li a");
    for (var i = 0; i <tabs.length; i++) {
        tabs[i].innerHTML="<i class=\""+cls+iconList.icons[i].icon.tags[0]+"\"></i>" + tabs[i].innerHTML;
    }
    $(".tabs>ul>li").className+="active-tab";
    window.addEventListener("hashchange",changeActiveTab,false);


}
var changeFocus = function(e){
	alert("hi");
}

var changeActiveTab = function(e){
    var oldHash = e.newURL.substring(e.oldURL.indexOf("#"));
    var newHash = e.newURL.substring(e.newURL.indexOf("#"));

   $(".active-tab").className="";
    $("a[href=\"" + newHash +"\"]").parentNode.className="active-tab";
}

function initialize () {	
	UTILS.ajax("data/config.json",{done:updatePage});
	UTILS.ajax("fonts/selection.json",{done:updateTabs});


}

window.onLoad = initialize();