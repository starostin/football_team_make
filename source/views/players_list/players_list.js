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
        'click .add-player': 'openAddPlayer',
        'click .add': 'addPlayer',
        'click .cancel': 'notAddPlayer',
        'webkitTransitionEnd .top': 'insertPlayerInList'
    },
    transitionOnce: 0,
    openAddPlayer: function(){
        console.log('=--=-==--=-=-=-=-=')
        var rectangle = this.el.querySelector('.add-player-rectangle');
        var top = rectangle.querySelector('.top');
        var add = rectangle.querySelector('.add');
        var cancel = rectangle.querySelector('.cancel');
        var playersList = this.el.querySelector('.players-list');
        top.classList.remove('hidden');
        top.querySelector('.add').classList.remove('hidden');
        top.querySelector('.cancel').classList.remove('hidden');
        rectangle.classList.add('rotation');
        playersList.style.marginTop = '75px';
    },
    addPlayer: function(){
        console.log('===============================')
        this.transitionOnce = 0;
        var rectangle = this.el.querySelector('.add-player-rectangle');
        var top = rectangle.querySelector('.top');
        var playersList = this.el.querySelector('.players-list');
//        top.classList.add('super-rotate');
        playersList.style.marginTop = '25px';
        top.classList.add('player');
        top.querySelector('.add').classList.add('hidden');
        top.querySelector('.cancel').classList.add('hidden');
    },
    notAddPlayer: function(){
        var rectangle = this.el.querySelector('.add-player-rectangle');
        var playersList = this.el.querySelector('.players-list');
        rectangle.classList.remove('rotation');
        playersList.style.marginTop = '0';
    },
    insertPlayerInList: function(){
        console.log('-------------------------------------')
        this.transitionOnce++;
        if(this.transitionOnce > 1){
            return;
        }
        var rectangle = this.el.querySelector('.add-player-rectangle');
        var top = rectangle.querySelector('.top');
        var li = document.createElement('li');
        li.classList.add('player');
        top.classList.add('hidden');
        top.classList.remove('player');
        rectangle.classList.remove('rotation');
        top.classList.remove('super-rotate');
        $('li.player').eq(0).before(li);
        this.refreshScroll();
    }
}));