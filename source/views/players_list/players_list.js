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
        window.scroll = this.mScroll;
    },
    newItemHeight: 150,
    onScroll: function(posit, type, e){
        console.log('----------------SCROLL-----------------')
        if(this.scrollStarted){
            this.scroll = e;
        }
        var self = this,
            newItem = this.el.querySelector('.new-item'),
            position = posit>> 0,
            isNewAdded = this.el.querySelector('.added'),
            $overlay = $(document).find('#overlay'),
            newItemHeight = this.newItemHeight,
            scroll = this.mScroll,
            cosinus,
            deg;

        if(this.removedAdd){
                cosinus = (newItemHeight - Math.abs(position))/newItemHeight;
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position===-newItemHeight || !position){
                $overlay.removeClass('show');
                scroll.mTopOffset = -newItemHeight;
//                scroll.scrollPosition = newItemHeight + scroll.scrollPosition;
                newItem.style.webkitTransform = 'rotateX(90deg)';
                this.removedAdd = false;
                this.render();
                var $listHeight = this.$el.find('ul').height();
                this.$el.find('ul').height($listHeight - newItemHeight);
                this.mScroll.refresh();
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
            return;
        }
        if (!isNewAdded && position >=0) {
                cosinus = (position)/newItemHeight,
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position > newItemHeight){
                deg = 0;
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
        } else if(isNewAdded && (position <= newItemHeight) && position === 0 && this.updateListHeight){
            this.updateListHeight = false;
            this.mScroll.refresh();
        }
    },
    onScrollStart: function(e){
        console.log('----------------------------------SCROLL START---------------------------')
        this.scrollStarted = true;
    },
    onScrollEnd: function(e){
        console.log('----------------------------------SCROLL END---------------------------')
        this.scrollEnd = this.scroll;
        var newItem = this.el.querySelector('.new-item'),
            scroll = this.mScroll,
            str = newItem.style.webkitTransform,
            a = str.split('('),
            b = a[1].split('deg'),
            deg = b[0],
            $listHeight;

        if(deg <= 10 && !newItem.classList.contains('added')){
            scroll.mTopOffset = 0;
            scroll.scrollPosition = scroll.scrollPosition - this.newItemHeight;
            newItem.style.webkitTransform = 'rotateX(0deg)';
            newItem.classList.add('added');
            $listHeight = this.$el.find('ul').height();
            this.$el.find('ul').height($listHeight + this.newItemHeight)
            this.updateListHeight = true;
        }
    },
    onSwipe: function(e, index){
        if(!e || !index){
            return;
        }
        var item = this.el.querySelector('[data-index="' + index +'"]'),
            style = item.style,
            scroll = this.mScroll;
        style.webkitTransform = 'translate3d(-' + (scroll.X[0] - e.clientX) + 'px, 0, 0)';
    },
    onSwipeStart: function(e){
        this.swipeFirst = {
            coord: e.clientX,
            timestamp: e.timeStamp
        };
    },
    onSwipeEnd: function(e, index){
        this.swipeLast = {
            coord: e.clientX,
            timestamp: e.timeStamp
        };
        var self = this,
            item = this.el.querySelector('[data-index="' + index +'"]');
        var speed = (this.swipeFirst.coord - this.swipeLast.coord)/(this.swipeLast.timestamp - this.swipeFirst.timestamp);
        var fromRight = item.getBoundingClientRect().right,
            width = item.getBoundingClientRect().width,
            player = this.model.at(index);

        this.swiping = true;
        item.style.webkitTransition = 0.5 + "s";
        if(width - fromRight > 200){
            item.style.webkitTransform = 'translate3d(-' + width + 'px, 0, 0)';
            item.addEventListener('webkitTransitionEnd', function(){
                console.log('-------------------REMOVING-----------------')
                console.log(index)
                self.model.remove(player, {silent: true});
                $(item).remove();
                item.style.webkitTransition = '';
                self.swiping = false;
            })
        }else{
            item.style.webkitTransform = 'translate3d(0, 0, 0)';
            item.addEventListener('webkitTransitionEnd', function(){
                item.style.webkitTransition = '';
                self.swiping = false;
            });
        }
    },
    rotateItem: function(e){
        console.log('-------------------ROTATE ITEM------------------')
        e.stopPropagation();
        if(!this.scrollEnd && e.target.classList.contains('back') && !this.swiping){
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
        if(this.mScroll.scrollPosition !==0){
            return;
        }
        var newItem = this.el.querySelector('.new-item'),
            $overlay = $(document).find('#overlay');

        $overlay.addClass('show');
        this.mScroll.scroll(-150, 270);
        newItem.classList.remove('added');
        this.removedAdd = true;
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
            addedItem = this.el.querySelector('.added'),
            $listHeight;

        addedItem.classList.add('rotate');
        addedItem.addEventListener('webkitTransitionEnd', function(){
            self.model.unshift(
                {
                    id: Math.random(),
                    name: 'oleg',
                    rate: 8,
                    class: ''
                });
            $listHeight = self.$el.find('ul').height();
            self.$el.find('ul').height($listHeight - self.newItemHeight)
            self.mScroll.refresh()
        })
    }
}));