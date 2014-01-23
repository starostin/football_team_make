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
        'click li': 'showPlayerInfo',
//        'mousedown ul': 'scroll',
//        'mouseup ul': 'stopMove'
    },
    scrollMove: function(e){
        console.log('-----------------SCROLL------------------');
    },
    stopMove: function(e){
        console.log('--------------------STOP SCROll------------------------');
        this.el.removeEventListener('mousemove', this.scrollMove, false)
    },
    scroll: function(e){
        console.log(e);
        this.el.addEventListener('mousemove', this.scrollMove, false)
      console.log('-=-==--=-=-=-=-=-=-=-==--=-=');
    },
    openAddPlayer: function(){
        console.log('=--=-==--=-=-=-=-=')
        console.log(this.mScroll)
        var self = this,
            insertPoint = this.$el.find("li:nth-child(1)");
        console.log(insertPoint)

        $("<li />", {
            'text': "New Item",
            'class': "new-item animated flipDown"
        }).insertBefore(insertPoint);
//        $('.new-item').css({height: '200px', webkitTransform: 'rotateX(0deg) perspective(500px)', webkitTransformOrigin: '50% 100%'});
        window.setTimeout(function(){
            console.log('++++++++++++++++++++++++++++')
            self.refreshScroll();
        }, 1000)
    },
    addPlayer: function(){
        console.log('===============================')

    },
    notAddPlayer: function(){

    },
    showPlayerInfo: function(e){
        var self = this,
            $target = $(e.currentTarget);
        $target.toggleClass('open');
        console.log('-------------------------------------');
        console.log(e.currentTarget)
        window.setTimeout(function(){
            self.refreshScroll();
        }, 1000)
    }
}));