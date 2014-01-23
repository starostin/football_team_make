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
    ],
    events: {
        'mousedown .page': 'scroll',
        'mouseup .page': 'stopMove'
    },
    scrollMove: function(e){
        console.log(e);
//        var list = this.el.querySelector('ul');
        console.log(this.el);
        console.log('-----------------SCROLL------------------');
    },
    stopMove: function(e){
        console.log('--------------------STOP SCROll------------------------');
        this.el.removeEventListener('mousemove', this.scrollMove, false)
    },
    scroll: function(e){
        var self = this;
        if(e.target.tagName !== 'LI') return;
        console.log(this.el.querySelector('ul').getBoundingClientRect());

        this.el.addEventListener('mousemove', this.scrollMove.bind(self), false)
        console.log('-=-==--=-=-=-=-=-=-=-==--=-=');
    }
}));