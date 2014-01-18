(function (document, window) {
    'use strict';

    var scripts = [
        "libs/iscroll.js",
        "libs/hammer.min.js",

        // Models


        // Application
        "source/application/application.js",

        // Views
        "source/views/main_screen/main_screen.js"

        // Service

    ];

    function onEndLoad() {

        var application = window.RAD.application;

        //initialize core by new application object
        window.RAD.core.initialize(application);

        //start
        application.start();
    }

    window.RAD.scriptLoader.loadScripts(scripts, onEndLoad);
}(document, window));