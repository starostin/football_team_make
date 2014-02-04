(function (document, window) {
    'use strict';

    var scripts = [
        "libs/scrollview.js",
        "libs/animator.js",
        "libs/utils.js",
        "libs/objectpool.js",
        "libs/gestureadapter.js",

        // Models
        "source/models/players.js",

        // Application
        "source/application/application.js",

        // Views
        "source/views/login/login.js",
        "source/views/main_screen/main_screen.js",
        "source/views/players_list/players_list.js"

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