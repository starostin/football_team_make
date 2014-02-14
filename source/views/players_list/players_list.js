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
        'click ul .item': 'rotateItem',
        'click .edit': 'editItem',
        'click .cancel': 'removeAdd'
    },
    pos: {},
    onInitialize: function(){
        this.model = RAD.models.players;
    },
    onEndRender: function(){
        var newItem = this.el.querySelector('.new-item');
        newItem.style.webkitTransform = 'rotateX(90deg)';
        newItem.style.webkitTransformOrigin =  '50% 100%';
//        window.scroll = this.mScroll;

//        this.removed = false;
    },
    newItemWidth: 150,
    onScroll: function(posit, type, e){
//        if(this.removed){
//            return;
//        }
        if(this.scrollStarted){
            this.scroll = e;
        }
        var newItem = this.el.querySelector('.new-item'),
            position = posit>> 0,
            isNewAdded = this.el.querySelector('.added');
        console.log(e)
        if(this.removedAdd){
            console.log('-=------------------------------SCROLL MOVE------------------------');
            console.log(position);
            var cosinus = (this.newItemWidth - Math.abs(position))/this.newItemWidth
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position===-this.newItemWidth){
                this.mScroll.mTopOffset = -this.newItemWidth;
//                this.mScroll.scrollPosition = this.newItemWidth + this.mScroll.scrollPosition;
                newItem.style.webkitTransform = 'rotateX(90deg)';
                this.removedAdd = false;
                this.mScroll.refresh();
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
            return;
        }
        if (!isNewAdded) {
            var cosinus = (position)/this.newItemWidth,
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position > this.newItemWidth){
                deg = 0;
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
        } else if(e && isNewAdded && (position <= this.newItemWidth)){
//            var cosinus = (this.newItemWidth - Math.abs(position))/this.newItemWidth,
//                deg = Math.acos(cosinus)*180/Math.PI;
//            if(position > 0){
//                deg = 0;
//            }
//            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
        }
    },
    onScrollStart: function(e){
        this.scrollStarted = true;
    },
    onScrollEnd: function(e){
        if(this.mScroll.swipe){
            console.log('------------------------END SWIPE---------------------')
        }
        this.scrollEnd = this.scroll;
        var newItem = this.el.querySelector('.new-item'),
            scroll = this.mScroll,
            str = newItem.style.webkitTransform,
            a = str.split('('),
            b = a[1].split('deg'),
            deg = b[0];
        console.log('-=------------------------------SCROLL END------------------------');
        console.log(deg)
        if(deg <= 10 && !newItem.classList.contains('added')){
            console.log('------------------------END ADD----------------------')
            scroll.mTopOffset = 0;
            scroll.scrollPosition = scroll.scrollPosition - this.newItemWidth;
            newItem.style.webkitTransform = 'rotateX(0deg)';
            newItem.classList.add('added')
        }else if(+deg && newItem.classList.contains('added')){
//            console.log('------------------------END REMOVE----------------------')
//            scroll.mTopOffset = -this.newItemWidth;
//            scroll.scrollPosition = this.newItemWidth + scroll.scrollPosition;
//            newItem.style.webkitTransform = 'rotateX(90deg)';
//            newItem.classList.remove('added')
        }
    },
    onSwipe: function(e, index){
        var item = this.el.querySelector('[data-index="' + index +'"]'),
            style = item.style,
            scroll = this.mScroll;
        style.webkitTransform = 'translate3d(-' + (scroll.X[0] - e.clientX) + 'px, 0, 0)';
        console.log(e)
    },
    rotateItem: function(e){
        e.stopPropagation();
        if(!this.scrollEnd && e.target.classList.contains('back')){
            var target = e.currentTarget,
                index = +target.getAttribute('data-index'),
                player = this.model.at(index);

            player.set({
                class: 'rotate'
            }, {silent: true})
            target.classList.add('rotate')
        }
    },
    removeAdd: function(e){
        var newItem = this.el.querySelector('.new-item');
        var self = this;
        var fps = 15;
        this.mScroll.scroll(-150, 270);
        newItem.classList.remove('added')
        this.removedAdd = true;

//        newItem.classList.add('removing');
//        newItem.style.webkitTransform = 'rotateX(90deg)';
//        function removing() {
//                this.requestId = webkitRequestAnimationFrame(removing);
//                // описываем один шаганимации тут
//                self.mScroll.scrollPosition = self.mScroll.scrollPosition - 3;
//                self.mScroll.setPosition(self.mScroll.scrollPosition);
//                var cosinus = (self.newItemWidth - Math.abs(self.mScroll.scrollPosition))/self.newItemWidth,
//                    deg = Math.acos(cosinus)*180/Math.PI;
////            if(position > 0){
////                deg = 0;
////            }
//                console.log('---------------------------------------');
//                console.log(deg);
//                console.log(self.mScroll.scrollPosition)
//                if(deg >= 11){
//                    newItem.classList.remove('added')
//                    window.webkitCancelRequestAnimationFrame(this.requestId);
//                    self.onScroll(self.mScroll.scrollPosition, 'tweak')
//                }
//                newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
//        }
//        removing();

//        function removing(){
//            console.log('============')
//            self.mScroll.scrollPosition = self.mScroll.scrollPosition - 1;
//            self.mScroll.setPosition(self.mScroll.scrollPosition);
//            var cosinus = (self.newItemWidth - Math.abs(self.mScroll.scrollPosition))/self.newItemWidth,
//                deg = Math.acos(cosinus)*180/Math.PI;
////            if(position > 0){
////                deg = 0;
////            }
//            console.log(deg)
//            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
//            window.setTimeout(removing, 0);
//        }
//        removing();
    },
    editItem: function(e){
        e.stopPropagation();
        var target = e.currentTarget,
            playerEl = target.parentNode.parentNode,
            index = +playerEl.getAttribute('data-index'),
            player = this.model.at(index);
        player.set({
            class: ''
        }, {silent: true})
        playerEl.classList.remove('rotate')
    },
    addPlayer: function(){
        var self = this,
            addedItem = this.el.querySelector('.added');

        addedItem.classList.add('rotate');
        addedItem.addEventListener('webkitTransitionEnd', function(){
            self.model.unshift(
                {
                    id: Math.random(),
                    name: 'oleg',
                    rate: 8,
                    class: ''
                });
        })

    }
}));