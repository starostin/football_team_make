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
        'tap .add': 'addPlayer',
        'tap .sec': 'sec',
        'tap .item': 'rotateItem',
        'tap .edit': 'editItem',
        'tap .cancel': 'removeAdd',
        'tapdown .thumb': 'startMoveSlider',
        'keyup .name': 'enterName'
    },
    listHeight: 0,
    rateSystem: 100,
    newItemHeight: 150,
    scrollOptions: {
        swipeTargetClass: 'back',
        topOffset: -150
    },
    onInitialize: function(){
        this.model = RAD.models.players;
        RAD.utils.createListStyles(".list li:nth-child({0})", 50, 1);
    },
    onEndRender: function(){
        var newItem = this.el.querySelector('.new-item');
        newItem.style.webkitTransform = 'rotateX(90deg)';
        newItem.style.webkitTransformOrigin =  '50% 100%';
        if(!this.marginTop){
            this.defineMarginTop();
            this.defineSliderCoef();
        }
        window.scroll = this.mScroll;
    },
    defineMarginTop: function(){
        this.marginTop = this.el.getBoundingClientRect().top;
    },
    defineSliderCoef: function(){
        var slider = this.$el.find('.slider').width(),
            thumb = this.$el.find('.thumb').width();

        this.sliderCoef = (slider - thumb)/this.rateSystem;
    },
    moveItemToBottom: function(elem){
        var self = this,
            elemCoord = elem.getBoundingClientRect();

        this.oldPosition = this.mScroll.scrollPosition;
        this.itemInBottom = true;
        window.setTimeout(function(){
            self.mScroll.setPosition(-(elemCoord.bottom - self.marginTop - self.newItemHeight) + self.mScroll.scrollPosition);
        }, 0);
        this.stopScroll();
    },
    moveItemInNormalPos: function(){
        var self = this;
        this.itemInBottom = false;
        window.setTimeout(function(){
            self.mScroll.setPosition(self.oldPosition);
        }, 0);
        this.startScroll();
    },
    enterName: function(e){
        var target = e.currentTarget,
            $playerEl = $(target).closest('.player'),
            name = target.value;

        if($playerEl.length){
            var playerId = +$playerEl.find('.item').data('id'),
                player = this.model.get(playerId);
            player.set({
                name: name
            }, {silent: true});
        }
    },
    startMoveSlider: function(e){
        var self = this,
            thumbElem = e.target,
            thumbCoords = thumbElem.getBoundingClientRect(),
            sliderElem = thumbElem.parentNode,
            shiftX = e.originalEvent.tapdown.screenX - thumbCoords.left,
            sliderCoords = sliderElem.getBoundingClientRect();

        this.el.addEventListener('tapmove', moveSlider, false);
        function moveSlider(e){
            var newLeft = e.tapmove.screenX - shiftX - sliderCoords.left;

            if (newLeft < 0) {
                newLeft = 0;
            }
            var rightEdge = sliderElem.offsetWidth - thumbElem.offsetWidth;
            if (newLeft > rightEdge) {
                newLeft = rightEdge;
            }
            self.updateRate(newLeft, sliderElem);

            thumbElem.style.webkitTransform = 'translateX(' + newLeft + 'px)';
        }
        this.el.addEventListener('tapup', function(){
            self.el.removeEventListener('tapmove', moveSlider, false);
            self.el.removeEventListener('tapup');
        }, false);
    },
    updateRate: function(number, el){
        var rateEl = el.nextElementSibling;
        var rate = Math.round(number/this.sliderCoef);
        var $playerEl = $(el).closest('.player');
        if($playerEl.length){
            var playerId = +$playerEl.find('.item').data('id')
            var player = this.model.get(playerId);
            player.set({
                rate: rate
            }, {silent: true});
        }
        rateEl.innerHTML = rate;
    },
    onScroll: function(position, type, e){
        if(this.scrollStarted){
            this.scroll = e;
        }
        var newItem = this.el.querySelector('.new-item'),
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
                newItem.style.webkitTransform = 'rotateX(90deg)';
                this.removedAdd = false;
                this.render();
                this.calculateListHeight('remove')
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
            return;
        }
        if (!isNewAdded && position >=0) {
                cosinus = (position)/newItemHeight;
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position > newItemHeight){
                deg = 0;
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
        } else if(isNewAdded && (position <= newItemHeight) && position === 0 && this.updateListHeight){
            this.updateListHeight = false;
            this.itemInBottom = true;
            this.calculateListHeight('add');
            this.stopScroll();
        }
    },
    onScrollStart: function(e){
        this.scrollStarted = true;
    },
    onScrollEnd: function(e){
        this.scrollEnd = this.scroll;
        var newItem = this.el.querySelector('.new-item'),
            scroll = this.mScroll,
            str = newItem.style.webkitTransform,
            a = str.split('('),
            b = a[1].split('deg'),
            deg = b[0];

        if(deg <= 10 && !newItem.classList.contains('added')){
            scroll.mTopOffset = 0;
            scroll.scrollPosition = scroll.scrollPosition - this.newItemHeight;
            newItem.style.webkitTransform = 'rotateX(0deg)';
            newItem.classList.add('added');
            this.updateListHeight = true;
        }
    },
    onSwipe: function(e, index){
        if(!e || !index || e.origin.target.classList.contains('front')){
            return;
        }
        var item = this.el.querySelector('[data-index="' + index +'"]'),
            style = item.style;

        style.webkitTransform = 'translate3d(-' + (this.mScroll.X[0] - e.clientX) + 'px, 0, 0)';
    },
    onSwipeStart: function(e, index){
        if(!e || !index || e.origin.target.classList.contains('front')){
            return;
        }
        var fakeEl = this.el.querySelector('.fake'),
            item = this.el.querySelector('[data-index="' + index +'"]'),
            removedLi = item.parentNode,
            top = removedLi.getBoundingClientRect().top - this.marginTop;

        fakeEl.style.top = top + 'px';
    },
    onSwipeEnd: function(e, index){
        var self = this,
            item = this.el.querySelector('[data-index="' + index +'"]'),
            itemCoord = item.getBoundingClientRect(),
            playerId = +item.getAttribute('data-id'),
            player = this.model.get(playerId),
            overlay = document.querySelector('#overlay'),
            removedLi = item.parentNode,
            fakeEl = this.el.querySelector('.fake');

        overlay.classList.add('show');
        this.swiping = true;
        item.style.webkitTransform = '';
        if(itemCoord.width - itemCoord.right > 200){
            item.classList.add('swipe_left');
            $(item).one('webkitTransitionEnd', function(){
                self.model.remove(player, {silent: true});
                removedLi.parentNode.removeChild(removedLi);
                fakeEl.classList.add('hide');
                $(fakeEl).one('webkitTransitionEnd', function(){
                    overlay.classList.remove('show');
                    fakeEl.classList.remove('hide');
                    fakeEl.style.top = '';
                    self.swiping = false;
                    var scrollTo = self.mScroll.scrollPosition;
                    self.calculateListHeight('remove');
                    self.mScroll.setPosition(scrollTo)
                })
            })
        }else if(itemCoord.left){
            item.classList.add('swipe_right');
            $(item).one('webkitTransitionEnd', function(){
                fakeEl.style.top = '';
                overlay.classList.remove('show');
                item.classList.remove('swipe_right');
                self.swiping = false;
            });
        }else{
            this.swiping = false;
            fakeEl.style.top = '';
            overlay.classList.remove('show');
        }
    },
    calculateListHeight: function(type){
        if(type === 'remove'){
            this.listHeight = this.listHeight - this.newItemHeight;
        }else if(type === 'add'){
            this.listHeight = this.listHeight + this.newItemHeight;
        }
        this.$el.find('.list').height(this.listHeight);
        this.mScroll.refresh();
    },
    rotateItem: function(e){
        if(this.itemInBottom || this.mScroll.scrollPosition > 0){
            return;
        }
        e.stopPropagation();
        if(!this.scrollEnd && e.target.classList.contains('back') && !this.swiping){
            var target = e.currentTarget,
                playerId = +target.getAttribute('data-id'),
                player = this.model.get(playerId);

            player.set({
                class: 'rotate'
            }, {silent: true});
            target.classList.add('rotate');
            this.moveItemToBottom(target)
        }
    },
    removeAdd: function(e){
        if(this.mScroll.scrollPosition !==0){
            return;
        }
        var newItem = this.el.querySelector('.new-item'),
            $overlay = $(document).find('#overlay');

        $overlay.addClass('show');
        this.mScroll.scroll(-this.newItemHeight, 270);
        newItem.classList.remove('added');
        this.removedAdd = true;
        this.itemInBottom = false;
    },
    editItem: function(e){
        var target = e.currentTarget,
            playerEl = target.parentNode.parentNode,
            playerId = +playerEl.getAttribute('data-id'),
            player = this.model.get(playerId);
        player.set({
            class: '',
            name: playerEl.querySelector('.name').value
        }, {silent: true});
        playerEl.classList.remove('rotate');
        this.moveItemInNormalPos();
    },
    addPlayer: function(){
        var self = this,
            addedItem = this.el.querySelector('.added');

        addedItem.classList.add('rotate');
        addedItem.addEventListener('webkitTransitionEnd', function(){
            self.model.unshift(
                {
                    id: parseInt(Math.random()*100),
                    name: addedItem.querySelector('.name').value,
                    rate: +addedItem.querySelector('.rate').innerHTML,
                    class: ''
                });
            self.calculateListHeight();
            self.itemInBottom = false;
        })
    }
}));