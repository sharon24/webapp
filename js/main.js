/* ------------------ helper functions  ----------------------------*/

function $(selector) {
    return document.querySelector(selector);
}

function all(selector) {
    return document.querySelectorAll(selector);
}



/* ------------------ page mangment functions  ----------------------------*/

//this fucntion loads the notfication ,prepers the event handlers, and reloads the data if there is data
function initialize() {
    UTILS.ajax("data/config.json", {done: updatePage});
    UTILS.ajax("fonts/selection.json", {done: updateTabs});

    var sButtons = all(".settings-icon");
    for (var i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", toggleSettingsDiv);
    }

    sButtons = all(".cancel");
    for (i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", cancelPress);
    }
    
    sButtons = all(".save");
    for (i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", savePress);
    }
    
    var inputs = all(".name , .url");
    for (i = 0; i < inputs.length; ++i) {
        inputs[i].addEventListener("keydown", inputKeyPress);
    }
    
    $(".input-search").addEventListener("keypress", searchEnter);
}   


//this fucntion calls fucntion to updates the notifcation area and quick actions  ,  
//and if local storage is not empty calls functions to load data from local storage 
function updatePage (data) {
    updateNotificationArea(data.notification);
    updateQuickActions(data.quickActions);
    if (localStorage.pageData != "" && localStorage.pageData != null) {
        updateFolders("quick-reports");
        updateFolders("my-team-folders");
    } else {
        localStorage.pageData = "";
    }
}


//this function update each of the folder tabs with data from localstoarge
function updateFolders (tabName) {
    var inputs = all("." + tabName + " .name" + ", ." + tabName + " .url");
    for (i = 0; i < inputs.length; i++) {
        var stringSearch = tabName + ":" + inputs[i].id + "=";
        if (localStorage.pageData.indexOf(stringSearch) != -1) {  //if data was in local stoarge, set input value to that data
            var indexStart = localStorage.pageData.indexOf(stringSearch) + stringSearch.length;
            var indexEnd = localStorage.pageData.indexOf(";", indexStart);
            inputs[i].value = localStorage.pageData.substring(indexStart, indexEnd);
        }
    }
    var pattern = "." + tabName + " .styled-select-list";
    var emptyFlag = true;
    $(pattern).innerHTML = "";
    for (var i = 0; i < inputs.length; i++) {//add drop down list and update iframe and expand button
        if (inputs[i].value != null && inputs[i].value != "") {
            if (i == 0) {
                $(pattern).innerHTML = $(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
                all(pattern + " li")[0].title = inputs[i + 1].value;
                $("." + $(pattern).parentNode.parentNode.className + " .frame-window").src = inputs[i + 1].value;
                $("." + $(pattern).parentNode.parentNode.className + " .expand-icon").href = inputs[i + 1].value;

            }
            $(pattern).innerHTML = $(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
            all(pattern + " li")[i / 2 + 1].title = inputs[i + 1].value;//set title to ease hover state
            emptyFlag = false;
        }
        i++;
    }
    if (emptyFlag == true) {
        $(pattern).style.display = "none";

        $("." + $(pattern).parentNode.parentNode.className + " .frame-window").src = "";
        $("." + $(pattern).parentNode.parentNode.className + " .expand-icon").href = "";
        $("." + $(pattern).parentNode.parentNode.className + " .expand-icon").style.display ="none";
    } else {
        $(pattern).style.display = "block";
        var listItems = all(pattern + " li");
        for (i = 0; i < listItems.length; i++) {
            listItems[i].addEventListener("click", openIframe); // add eventlistner for each drop down option
        }
         $("." + $(pattern).parentNode.parentNode.className + " .expand-icon").style.display ="block";
        var settingsDiv = $("." + $(pattern).parentNode.parentNode.className + " .settings");
        settingsDiv.style.display = "none";
        settingsDiv.style.height = "0";
        $("." + tabName + " .settings-icon-wrapper").style.backgroundColor = "transparent";
        listItems[0].click();//if there is data force the window to open the first iframe by click
    }
}

function updateNotificationArea(data) {
    if (data !== undefined) {
        $(".notifications").innerHTML = "<p>" + data + "</p>";
    }
}

//dinamcly create the quick actions list , add support to hover over div, add tabindex to support keyboard actions
//(as some of the elements do not support keyboard focus by defual e.g div)
function updateQuickActions (quickActions) {
    var navSections = all(".nav-section");
    if (quickActions !== undefined) {
        for (var i = 0; i < quickActions.length; i++) {
            navSections[i].innerHTML = "<p>" + quickActions[i].label + "</p>" + navSections[i].innerHTML;
            navSections[i].style.background = "black url(./img/icons/" + quickActions[i].icon + ".png)  left 50% top 77px no-repeat";
            navSections[i].addEventListener("focus", changeFocusNav, false);
            navSections[i].addEventListener("mouseleave", ignoreClick, false);
        }
        var menuCaptions = all(".menu-caption");
        for (i = 0; i < quickActions.length; i++) {
            menuCaptions[i].innerHTML = "<p>" + quickActions[i].actionsLabel + "</p>";
        }
        var g = 4;//start of tabindex 
        var q = 0;
        var actionLists = all(".action-list");
        for (i = 0; i < quickActions.length; i++) {
            for (var j = 0; j < quickActions[i].actions.length; j++) {
                actionLists[i].innerHTML += "<li><a tabindex=\"" + g + "\" href=\"" + quickActions[i].actions[j].url + "\">" + quickActions[i].actions[j].label + "</a></li>";
                g++;
                //if (j+1 == quickActions[i].actions.length) {
                all(".action-list li >a")[q].addEventListener("blur", changeFocus, false);
                //}
                q++;
            }
            g++;
        }
    }
}

//used to prevent click on div 
function ignoreClick(e) {
    if (document.activeElement === this) {
        this.blur();
        this.querySelector(".action-list").style.display = "none";
    }
}


//load icons dinamcly ,and naviagte to proper tab
function updateTabs (iconList) {
    var cls = iconList.preferences.fontPref.prefix;
    var tabs = all(".tabs >ul li a");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].innerHTML = "<i class=\"" + cls + iconList.icons[i].icon.tags[0] + "\"></i>" + tabs[i].innerHTML;
    }
    if (window.location.href.indexOf("#") == -1) { //if hash is empty make the first tab active
        $(".tabs>ul>li").className += "active-tab";
        $(".tabs>div").style.display = "block";
    } else { //read hash and make the active tab acording to hash
        var newHash = window.location.href.substring(window.location.href.indexOf("#"));
        $("a[href=\"" + newHash + "\"]").parentNode.className = "active-tab";
        $(newHash).style.display = "block";
    }
    window.addEventListener("hashchange", changeActiveTab, false);

}
 

 //handel blur
function changeFocus(e) {
    this.parentNode.parentNode.style.display = "none";
}
//handel focus
function changeFocusNav (e) {
    this.querySelector(".action-list").style.display = "block";
}


//handel change of tab
function changeActiveTab(e) {
    var newHash = e.newURL.substring(e.newURL.indexOf("#"));
    var tabDivs = all(".tabs > div");
    for (var i = 0; i < tabDivs.length; i++) {
        tabDivs[i].style.display = "none";
    }
    $(newHash).style.display = "block";
    $(".active-tab").className = "";
    $("a[href=\"" + newHash + "\"]").parentNode.className = "active-tab";
}


//handel setting button press
function toggleSettingsDiv() {
    var parentClass = this.parentNode.parentNode.parentNode.className;
    var settingsDiv = $("." + parentClass + "> .settings");
    if (settingsDiv.style.display == "none") {
        settingsDiv.style.display = "block";
        settingsDiv.style.height = "36%";
        this.parentNode.style.backgroundColor = "white";
        $("." + parentClass + " .name").focus();
    }
    else {
        settingsDiv.style.display = "none";
        settingsDiv.style.height = "0";
        this.parentNode.style.backgroundColor = "transparent";
    }
}


//checks input , uses delfualt url regex validation by type, if need adds http, and if data is valid saves to local storage 
//and update drop down list ,icons and iframes
function savePress() {
    var parentClass = this.parentNode.parentNode.parentNode.parentNode.className;
    var inputs = all("." + parentClass + " .name ," + "." + parentClass + " .url");
    var validated = true;
    for (var i = 0; i < inputs.length; i += 2) {
        if (( inputs[i + 1].value != null && inputs[i + 1].value != "") || ( inputs[i].value != null && inputs[i].value != "")) {
            inputs[i].required = true;
            inputs[i + 1].required = true;
            validated = false;
            if (( inputs[i + 1].value != null && inputs[i + 1].value != "") && ( inputs[i].value != null && inputs[i].value != "")) {
                validated = true;
            }
        }
        if (( inputs[i + 1].value == null || inputs[i + 1].value == "") && ( inputs[i].value == null || inputs[i].value == "")) {
            inputs[i].required = false;
            inputs[i + 1].required = false;
            validated = true;
        }
        if (inputs[i +1]!= null && inputs[i+1].value != ""  && inputs[i+1].value.indexOf("http://") ==-1 &&  inputs[i+1].value.indexOf("https://") ==-1) {
            inputs[i+1].value="http://"+inputs[i+1].value;
        }
    }

    if (validated == true && this.parentNode.parentNode.checkValidity()) {  //if valid save to local storage and update tab objects (e.g drop down list)
        parentClass = this.parentNode.parentNode.parentNode.parentNode.id;
        var pattern = parentClass + ":.+?;";
        var regexp = new RegExp(pattern, "g");
        localStorage.pageData = localStorage.pageData.replace(regexp, "");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value != null && inputs[i].value != "") {
                    localStorage.pageData = localStorage.pageData + parentClass + ":" + inputs[i].id + "=" + inputs[i].value + ";";
            }
        }
        pattern = "." + this.parentNode.parentNode.parentNode.parentNode.className + " .styled-select-list";
        var emptyFlag = true;
        $(pattern).innerHTML = "";
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value != null && inputs[i].value != "") {
                if (i == 0) {
                    $(pattern).innerHTML = $(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
                    all(pattern + " li")[0].title = inputs[i + 1].value;
                }
                $(pattern).innerHTML = $(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
                all(pattern + " li")[i / 2 + 1].title = inputs[i + 1].value;
                emptyFlag = false;
            }
            i++;
        }
        if (emptyFlag == true) {  //clear  iframe and expand
            $(pattern).style.display = "none";
            $("." + this.parentNode.parentNode.parentNode.parentNode.className + " .frame-window").src = "";
            $("." + this.parentNode.parentNode.parentNode.parentNode.className + " .expand-icon").href = "";
             $("." + this.parentNode.parentNode.parentNode.parentNode.className + " .expand-icon").style.display ="none";
        } else {
            $(pattern).style.display = "block";
            var listItems = all(pattern + " li");
            for (i = 0; i < listItems.length; i++) {
                listItems[i].addEventListener("click", openIframe);
            }
             $("." + this.parentNode.parentNode.parentNode.parentNode.className + " .expand-icon").style.display ="block";

        }
        $("." + this.parentNode.parentNode.parentNode.parentNode.className + " .settings-icon").click();
        all(pattern + " li")[0].click();
    }
}   
//handel drop down list click
function openIframe() {
    $("." + this.parentNode.parentNode.parentNode.className + " .frame-window").src = this.title;
    $("." + this.parentNode.parentNode.parentNode.className + " .expand-icon").href = this.title;
    this.parentNode.parentNode.querySelector("li").title = this.title;
    this.parentNode.parentNode.querySelector("li").innerHTML = this.innerHTML;
    this.parentNode.parentNode.querySelector("li").addEventListener("click", openIframe);
}

//handels cancel press, if cancel is  pressed clear data and reload it from localstorage
function cancelPress() {
    var parentClass = this.parentNode.parentNode.parentNode.parentNode.className;
    var inputsList = all("." + parentClass + " .url ," + "." + parentClass + " .name");
    for (var i = 0; i < inputsList.length; ++i) {
        inputsList[i].value = "";
    }
    var settingsDiv = $("." + parentClass + " .settings");
    settingsDiv.style.display = "none";
    settingsDiv.style.height = "0";
    $("." + parentClass + " .settings-icon-wrapper").style.backgroundColor = "transparent";
    updateFolders(parentClass);
}

//handle search ,support enter button only 
function searchEnter(e) {
    var enteredKey = e.which;
    if (enteredKey == 13) {
        var dropDownList=all(".styled-select-list li");
        for (var i=0; i<dropDownList.length; i++) {
            if (dropDownList[i].innerHTML == this.value) {
                $(".tabs ul li a[href=\"#" +dropDownList[i].parentNode.parentNode.parentNode.className +"\"]" ).click();
                dropDownList[i].click();
                i=dropDownList.length +1;
            }
        }
        if (i ==dropDownList.length) {//if not found update notifcation
            $(".notifications").innerHTML = "<p>" + "The searched report " + this.value +" was not found"+ "</p>";
        }
    }
}

//handel enter and esc in input fields
function inputKeyPress(e) {
    var keynum = e.which;
    if ( keynum ==27 || keynum ==0) {  //firefox =0 ,chrome =27 
        var className = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className;
        $("." + className + " .cancel").click();
    } else if (keynum == 13 ) {
        $("." + className + " .save").click();
    }


}

//when page loads run initialize to load data from json and localstorage and preape the window
window.onLoad = initialize();



