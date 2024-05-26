// Cookie check function to redirect the user to correct language if required.
function setCookie(cname, cvalue, exminutes) {
    var d = new Date();
    d.setTime(d.getTime() + (exminutes * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function redirectIfRequired() {
    var language = navigator.language || navigator.userLanguage;
    if ((language.indexOf('tr') > -1 || getCookie("country") === "TR")
        && window.location.pathname.indexOf('/index.html') === -1
        && window.location.pathname.indexOf('/tr') === -1) {
        setCookie('redirected', 'tr', 1);
        window.location = '/tr';
    }
}

// Redirection point.
// redirectIfRequired();

// If the user not redirected. Set the country cookie data if it not set before.
function setByLocation(countryCode) {
    if (countryCode === "TR") redirectIfRequired();
}

function getIPDetails(func) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            func(JSON.parse(xhttp.responseText));
            return true;
        }
        func({})
        return false;
    };
    xhttp.open("GET", "https://ipapi.co/json/", true);
    xhttp.send();
}

//var countryCode = getCookie("country");
//if (countryCode !== "") setByLocation(countryCode);
//else {
//    getIPDetails(function (result) {
//        if (result.hasOwnProperty('country')) {
//            countryCode = result.country;
//        }
//        else if (new Date().toString().indexOf("Turkey") !== -1) {
//            countryCode = "TR";
//        }
//        setCookie("country", countryCode, 60 * 24 * 30);
//        setByLocation(countryCode);
//    });
//}
