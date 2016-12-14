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

    //super annoying while developing
    //var timer = setInterval(getHeat, 30000);
});
// globale Variable für den Hostnamen
// -> verschwindet leider beim neu laden :-(
var serverHostName;

// Definiere pressEnter-Event, benötigt für Text-Felder
$.fn.pressEnter = function(fn) {
    return this.each(function() {
        $(this).bind('enterPress', fn);
        $(this).keyup(function(e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterPress");
            }
        });
    });
};

// On Device Ready - wird nach dem Laden des Dokuments ausgeführt (wenn das DOM vollständig aufgebaut wurde)
$(document).ready(function() {
    onDeviceReady();
});

// Initialisierung
function onDeviceReady() {

    // Servername standardmäßig auf aktuellen Host aktualisieren - hier könnte man vielleicht eine HTML5-API verwenden?!
    updateServer(location.host);

    // Button #mainSetting -> Dialogfenster anzeigen
    // (ggf. ID von mainSettings passend zu Button im Footer anpassen)
    $("#mainSettings").unbind('click').click(function() {
        $("#tfdIpAdress").val(serverHostName);
        $("#dialogServer").modal({onOpen: function (dialog) {
            dialog.container.show();
            /* Animiere Fade in */
            dialog.data.fadeIn('slow');
        }});
    });

    // Button #setServer ->Verarbeite Klick auf Button setServer
    $('#setServer').unbind('click').click(function() {
        // Get value from text-field
        updateServer($('#tfdIpAdress').val());
        // close dialog
        $.modal.close();
    });

    // Verwende auch Enter-Taste im Textfeld
    $("#tfdIpAdress").pressEnter(function() {
        $("#setServer").trigger('click');
    });

    // Blende Willkommen-Dialog ein
    $("#dialogWelcome").modal();
}

/* Aktualisiere Server-Name */
function updateServer(hostname)
{
    /* Default hostname: http://localhost:8080 */
    if (hostname === "")
    {
        hostname = "http://localhost:8080";
    }

    /* Add http:// if no valid protocol was found in URI */
    if ((hostname.substring(0, 7) != "http://") && (hostname.substring(0, 8) != "https://")) {
        hostname = "http://" + hostname;
    }
    /* Remove trailing / */
    hostname = hostname.replace(/\/$/, "");
    /* Update dialog */
    $("#tfdIpAdress").val(hostname);
    /* Update setting - vielleicht besser mit HTML5-API?*/
    serverHostName = hostname;
}
//# sourceMappingURL=global.js.map