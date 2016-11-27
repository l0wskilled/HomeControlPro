var baseUrl = "http://localhost:8080";

function fixUrl(urlPart) {
    if (urlPart.charAt(0) != "/")
        urlPart = "/" + urlPart;
    if (urlPart.substring(urlPart.length - 3, urlPart.length) == "get")
        urlPart += "/";
    return urlPart;
}

function getHeat() {
    var urlPart = fixUrl("temp/get");
    var jqxhr = $.getJSON(baseUrl + urlPart, function () {
            var obj = $.parseJSON(jqxhr.responseText);
            console.log(obj);
            $('#heatCurrent').val(obj.temperature);
        })
        .fail(function () {
            alert("Error connecting to  API!");
        });
}

function getCurrentValues() {
    var urlPart = fixUrl("temp/get");
    var jqxhr = $.getJSON(baseUrl + urlPart, function () {
            var obj = $.parseJSON(jqxhr.responseText);
            console.log(obj);
            $('#heatCurrent').val(obj.temperature);
            $('#heatWanted').val(obj.wanted);
            if (obj.autodown == false)
                $('#heatAuto').prop('checked', false);
            else
                $('#heatAuto').prop('checked', true);
        })
        .fail(function () {
            alert("Error connecting to  API!");
        });
}

function autoHeatChanged(obj) {
    var urlPart = "temp/set/autodown/";
    if (obj.prop('checked')) {
        urlPart += "on";
    } else {
        urlPart += "off";
    }
    urlPart = fixUrl(urlPart);
    var jqxhr = $.getJSON(baseUrl + urlPart, function () {
            var obj = $.parseJSON(jqxhr.responseText);
            console.log(obj);
            $('#heatCurrent').val(obj.temperature);
        })
        .fail(function () {
            alert("Error connecting to  API!");
        });
}

function heatWantedChanged(obj) {
    var wantedHeat = obj.val();
    urlPart = fixUrl("temp/set/wanted/" + wantedHeat);
    var jqxhr = $.getJSON(baseUrl + urlPart, function () {
            var obj = $.parseJSON(jqxhr.responseText);
            console.log(obj);
            $('#heatCurrent').val(obj.temperature);
        })
        .fail(function () {
            alert("Error connecting to  API!");
        });
}

$(document).ready(function () {
    getCurrentValues();

    $('#heatAuto').change(function () {
        autoHeatChanged($(this));
    });

    $('#heatWanted').change(function () {
        heatWantedChanged($(this));
    });

    var timer = setInterval(getHeat, 30000);
});