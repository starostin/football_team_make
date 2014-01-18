RAD.application(function (core) {
    'use strict';

    var app = this;

    app.start = function () {
        var options = {
                container_id: '#screen',
                content: "view.main_screen",
                animation: 'none'
            };

        core.publish('navigation.show', options);
    };

    return app;
}, true);

