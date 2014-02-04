RAD.view("view.main_screen", RAD.Blanks.View.extend({
    url: 'source/views/main_screen/main_screen.html',
    children: [
        {
            container_id: '.players-list',
            content: "view.players_list"
        }
    ]
}));