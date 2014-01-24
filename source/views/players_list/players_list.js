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
//        'click .add-player': 'openAddPlayer',
        'click .add': 'addPlayer',
        'click .cancel': 'notAddPlayer',
        'click li': 'showPlayerInfo',
//        'mousedown ul': 'scroll',
//        'mouseup ul': 'stopMove'
    },
    onStartAttach: function(){
        var self = this;
        this.mScroll.options.onScrollStart = function(e){
            console.log(e)
            var insertPoint = self.$el.find("li:nth-child(1)");
            $('ul').css({
                'top': '-48px'
            });
            $("<li />", {
                'text': "New Item",
                'height': '48px',
                'class': 'new'
            }).insertBefore(insertPoint);
            $('.new').css({
                'background': 'green',
                'webkitTransform': 'rotateX(48deg)',
                'webkitPerspectiveOrigin': '50% 100%',
                'webkitTransformOrigin': '0 100%'
            })

        };
        this.mScroll.options.onScrollMove = function(e){
            var deg = 48 - (self.el.querySelector('.first').getBoundingClientRect().top - 40);
            var top = '-' + deg;
            console.log(self.el.querySelector('.first').getBoundingClientRect().top-40)
            console.log(deg)
            $('.new').css({
                webkitTransform: 'rotateX(' + deg + 'deg)'
            })
            $('ul').css({
                top: top
            })
        }
    },
//    scrollMove: function(e){
//        console.log('-----------------SCROLL------------------');
//    },
//    stopMove: function(e){
//        console.log('--------------------STOP SCROll------------------------');
//        this.el.removeEventListener('mousemove', this.scrollMove, false)
//    },
//    scroll: function(e){
//        console.log(e);
//        this.el.addEventListener('mousemove', this.scrollMove, false)
//      console.log('-=-==--=-=-=-=-=-=-=-==--=-=');
//    },
    openAddPlayer: function(){
        console.log('=--=-==--=-=-=-=-=');
        var self = this,
            insertPoint = this.$el.find("li:nth-child(1)");
        console.log(insertPoint)
        $('ul').addClass('top')

        $("<li />", {
            'text': "New Item",
            'class': "new-item"
        }).insertBefore(insertPoint);
//        $('.new-item').css({height: '200px', webkitTransform: 'rotateX(0deg) perspective(500px)', webkitTransformOrigin: '50% 100%'});

        window.setTimeout(function(){
            self.el.querySelector('ul').classList.add('rotate')
            console.log('++++++++++++++++++++++++++++')
            self.refreshScroll();
        }, 0)
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