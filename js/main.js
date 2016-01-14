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
		 navSections[i].addEventListener("focus",changeFocusNav,false);

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


 			if (j+1 == quickActions[i].actions.length) {
				 all(".action-list li >a")[q].addEventListener("blur",changeFocus,false);
				}
				 q++;
				 
				
			}
			g++;
		}

	}



}

var updateTabs = function(iconList){
    var cls=iconList.preferences.fontPref.prefix;
    var tabs= all(".tabs ul li a");
    for (var i = 0; i <tabs.length; i++) {
        tabs[i].innerHTML="<i class=\""+cls+iconList.icons[i].icon.tags[0]+"\"></i>" + tabs[i].innerHTML;
    }
    $(".tabs>ul>li").className+="active-tab";
    //all(".tabs >div").style.display="none";
    $(".tabs>div").style.display="block";
    window.addEventListener("hashchange",changeActiveTab,false);


}
var changeFocus = function(e){
	//alert(this.parentNode.parentNode.parentNode);

	this.parentNode.parentNode.style.display ="none";
}

var changeFocusNav = function(e){

			this.querySelector(".action-list").style.display = "block";


}



var changeActiveTab = function(e){
    var oldHash = e.oldURL.substring(e.oldURL.indexOf("#"));
    var newHash = e.newURL.substring(e.newURL.indexOf("#"));


var tabDivs=all(".tabs > div");
 for (var i = 0; i <tabDivs.length; i++) {
tabDivs[i].style.display ="none";  //done in case of reload when you cannot tell which was the last active tab
}

  $(newHash).style.display ="block";


   $(".active-tab").className="";
    $("a[href=\"" + newHash +"\"]").parentNode.className="active-tab";


}

function initialize () {	
	UTILS.ajax("data/config.json",{done:updatePage});
	UTILS.ajax("fonts/selection.json",{done:updateTabs});


}

window.onLoad = initialize();