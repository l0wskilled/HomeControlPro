// globale Variable für den Hostnamen
// -> verschwindet leider beim neu laden :-(
var serverHostName;

if (typeof(Storage) !== "undefined") {
    serverHostName = localStorage.getItem('serverHostName');
}

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
    if (localStorage.getItem('serverHostName') != null) {
        updateServer(serverHostName);
    } else {
        updateServer(location.host);
    }


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
    if (sessionStorage.getItem('welcome-shown') != 'true') {
        $("#dialogWelcome").modal();
        sessionStorage.setItem('welcome-shown', 'true');
    }
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
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('serverHostName', serverHostName);
    }
}