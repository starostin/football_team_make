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
        window.scroll = this.mScroll;
        this.el.querySelector('.container').style.height = window.innerHeight + 150 + 'px';
        this.mScroll.options.topOffset = 150;
        console.log('---------------------SCROLL------------------');


        this.mScroll.options.onScrollStart = function(e){
            self.$el.find('.new-item').css({
                'webkitTransform': 'rotateX(90deg)',
                'webkitTransformOrigin': '50% 100%'
            })

        };
        this.mScroll.options.onScrollMove = function(e){
            console.log(this.y)
            var cosinus = (150 - Math.abs(this.y))/150,
                deg = Math.acos(cosinus)*180/Math.PI;
            console.log(deg)
            self.$el.find('.new-item').css({
                webkitTransform: 'rotateX(' + deg + 'deg)'
            });
            if(deg<10){
                console.log('-=-==--=-=-=-=-==')
            }
        };
        this.mScroll.options.onTouchEnd = function(e){
//            self.$el.find('.new-item').css({
//                'webkitTransform': 'rotateX(90deg)',
//                'webkitTransformOrigin': '50% 100%'
//            })
//            if(self.end) return;
////            var $list = self.$el.find('ul');
//            var firstLi = self.el.querySelector('li:nth-child(2)');
//            var top = newLiHeight - (firstLi.getBoundingClientRect().top - fromTop);
//            var el = self.el.querySelector('.new');
//            var styles = window.getComputedStyle(el, null);
//            var tr = styles.getPropertyValue("-webkit-transform");
//            var values = tr.split('(')[1];
//            values = values.split(')')[0];
//            values = values.split(',');
//
//            var b = values[6]; // 0.5
//            var deg = Math.round(Math.asin(b) * (180/Math.PI));
//            console.log('##########################', deg);
//
//            self.autoRotate(deg, top);
        }
    },
    autoRotate: function(deg, top){
        if(deg<10){
            this.addingNew(deg, top);
        }else{
            this.removingNew();
        }
    },
    removingNew: function(){
        if(this.$el.find('.new').length){
//            this.$el.find('ul').css({
////                'webkitTransition': 'all 3s',
//                'webkitTransform': 'translateY(-150px)'
//            });
            this.$el.find('.new').css({
                'webkitTransition': ' all 3s',
                'webkitTransform': 'rotateX(90deg)'
            });
            this.$el.find('ul').one('webkitTransitionEnd', function(){
                $(this).css({
                    'webkitTransition': 'none'
                });
                $(this).css({
                    'webkitTransform': 'translateY(0px)'
                });
                $(this).find('.new').remove();
            })
        }
    },
    addingNew: function(deg, top){
        var self = this;
        if(this.$el.find('.new').length){
            console.log(deg)
            console.log('!!!!!!!!!!!!!!!!!!', top);
//            this.$el.find('ul').css({
//                'webkitTransform': 'translateY(-'+ top +'px)'
//            });
//                this.$el.find('.container').css({
////                    'webkitTransition': 'all 0.5s',
//                    'top': '150px'
//                });

            this.$el.find('.new').css({
                'webkitTransition': ' all 0s',
                'webkitTransform': 'rotateX(0deg)'
            });
            this.end = true;
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
//            self.el.querySelector('ul').classList.add('rotate')
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