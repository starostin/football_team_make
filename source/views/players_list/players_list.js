/**
 * Created with JetBrains PhpStorm.
 * User: ОлеЖка
 * Date: 18.01.14
 * Time: 14:32
 * To change this template use File | Settings | File Templates.
 */
RAD.view("view.players_list", RAD.Blanks.ScrollableView.extend({
    url: 'source/views/players_list/players_list.html',
    events: {
        'click .add-player': 'openAddPlayer'
    },
    openAddPlayer: function(){
        console.log('=--=-==--=-=-=-=-=')
        var rectangle = this.el.querySelector('.add-player-rectangle');
        var div = document.createElement('div');
        div.classList.add('top');
        rectangle.appendChild(div);
        rectangle.classList.add('rotation')
    }
}));