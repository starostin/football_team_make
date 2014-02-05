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
        'click .add': 'addPlayer',
        'click .sec': 'sec',
        'click .cancel': 'notAddPlayer'
    },
    onInitialize: function(){
        this.model = RAD.models.players;
    },
    onEndRender: function(){
        var newItem = document.querySelector('.new-item');
        newItem.style.webkitTransform = 'rotateX(90deg)';
        newItem.style.webkitTransformOrigin =  '50% 100%';
    },
    onScroll: function(position, type){
        var self = this;
        var newItem = document.querySelector('.new-item');

        if (!$('.added').length) {
            var cosinus = (position>>0)/150,
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position>>0 > 150){
                deg = 0;
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
        } else if($('.added').length && (type === 'move') && !this.flag && (position>>0 <= 150)){
            var cosinus = (150 - Math.abs(position>>0))/150,
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position>>0 > 0){
                deg = 0;
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
            self.itemAdded = false;
        }
        if(this.flag){
            self.flag = false;
        }
        self.pos = position;
    },
    onScrollEnd: function(){
        var self = this;
        var newItem = document.querySelector('.new-item');
        if(!self.itemAdded){
            var str = newItem.style.webkitTransform,
                a = str.split('('),
                b = a[1].split('deg'),
                deg = b[0];

            if(deg < 20 && !newItem.classList.contains('added')){
                self.itemAdded = true;
                self.mScroll.mTopOffset = 0;
                self.mScroll.scrollPosition = self.mScroll.scrollPosition-150;
                self.flag = true;
                newItem.style.webkitTransform = 'rotateX(0deg)';
                newItem.classList.add('added')
            }else if(+deg && newItem.classList.contains('added')){
                self.itemAdded = false;
                self.mScroll.mTopOffset = -150;
                self.mScroll.scrollPosition = 150 + self.mScroll.scrollPosition;
                newItem.style.webkitTransform = 'rotateX(90deg)';
                newItem.classList.remove('added')
            }
        }
    },
    directionForward: function(pos){
        return pos >= this.pos
    },
    addPlayer: function(){
        var self = this
        $('.added').addClass('animate');
        $('.added').css({
            'webkitTransition': 'all 0.5s'
        })
        $('.added').addClass('likeLi')
        document.querySelector('.added').addEventListener('webkitTransitionEnd', function(){
            self.model.add([
                {
                    id: 1,
                    name: 'oleg',
                    rate: 8
                }
            ]);
        })


    },
    sec: function(){
        this.model.add([
            {
                id: 2,
                name: '4433',
                rate: 22
            }
        ])
    }
}));