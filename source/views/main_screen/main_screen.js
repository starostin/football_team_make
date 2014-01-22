/**
 * Created with JetBrains PhpStorm.
 * User: ОлеЖка
 * Date: 18.01.14
 * Time: 13:31
 * To change this template use File | Settings | File Templates.
 */
RAD.view("view.main_screen", RAD.Blanks.View.extend({
    url: 'source/views/main_screen/main_screen.html',
    children: [
        {
            container_id: '.players-list',
            content: "view.players_list"
        }
    ]
}));