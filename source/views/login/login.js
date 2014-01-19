RAD.view("view.login", RAD.Blanks.View.extend({
    url: 'source/views/login/login.html',
    events: {
        "click #quick_sep": 'openListScreen'
    },
    openListScreen: function(){
        var options = {
            container_id: '#screen',
            content: "view.main_screen",
            animation: 'fade'
        };
        this.publish('navigation.show', options);
    }
}));