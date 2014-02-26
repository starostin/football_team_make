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
        'click .item': 'rotateItem',
        'click .edit': 'editItem',
        'click .cancel': 'removeAdd',
        'tapdown .thumb': 'startMoveSlider',
        'keyup .name': 'enterName'
    },
    listHeight: 0,
    rateSystem: 100,
    coef: 2.6,
    onInitialize: function(){
        this.model = RAD.models.players;
        this.createListStyles(".list li:nth-child({0})", 50, 1);
    },
    enterName: function(e){
        var target = e.currentTarget;
        var $playerEl = $(target).closest('.player');
        var name = target.value;
        console.log($playerEl);
        if($playerEl.length){
            var playerId = +$playerEl.find('.item').data('id')
            var player = this.model.get(playerId);
            player.set({
                name: name
            }, {silent: true});
        }
    },
    startMoveSlider: function(e){
        var self = this;
        var thumbElem = e.target;
        var thumbCoords = thumbElem.getBoundingClientRect();
        var sliderElem = thumbElem.parentNode;
        var shiftX = e.originalEvent.tapdown.screenX - thumbCoords.left;
        var sliderCoords = sliderElem.getBoundingClientRect();
        this.sliderWidth = sliderCoords.width - thumbCoords.width;
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
        var rate = Math.round(number/this.coef);
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
    createListStyles: function(rulePattern, rows, cols) {
        var rules = [], index = 0;
        for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (var colIndex = 0; colIndex < cols; colIndex++) {
                var x = (colIndex * 100) + "%",
                    y = (rowIndex * 100) + "%",
                    transforms = "{ -webkit-transform: translate3d(" + x + ", " + y + ", 0); transform: translate3d(" + x + ", " + y + ", 0); }";
                rules.push(rulePattern.replace("{0}", ++index) + transforms);
            }
        }
        var headElem = document.getElementsByTagName("head")[0],
            styleElem = $("<style>").attr("type", "text/css").appendTo(headElem)[0];
        if (styleElem.styleSheet) {
            styleElem.styleSheet.cssText = rules.join("\n");
        } else {
            styleElem.textContent = rules.join("\n");
        }
    },
    onEndRender: function(){
        var newItem = this.el.querySelector('.new-item');
        newItem.style.webkitTransform = 'rotateX(90deg)';
        newItem.style.webkitTransformOrigin =  '50% 100%';
        window.scroll = this.mScroll;
    },
    newItemHeight: 150,
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
            this.calculateListHeight('add');
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
        console.log(e)
        var item = this.el.querySelector('[data-index="' + index +'"]'),
            style = item.style;

        style.webkitTransform = 'translate3d(-' + (this.mScroll.X[0] - e.clientX) + 'px, 0, 0)';
    },
    onSwipeStart: function(e, index){
        console.log(e)
        if(!e || !index || e.origin.target.classList.contains('front')){
            return;
        }
        var fakeEl = this.el.querySelector('.fake'),
            item = this.el.querySelector('[data-index="' + index +'"]'),
            removedLi = item.parentNode,
            top = removedLi.getBoundingClientRect().top - 40;

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


//        overlay.classList.add('show');
        console.log(item.getBoundingClientRect());
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
            fakeEl.style.top = '';
        }
    },
    calculateListHeight: function(type){
        if(type === 'remove'){
            this.listHeight = this.listHeight - 150;
        }else if(type === 'add'){
            this.listHeight = this.listHeight + 150;
        }
        this.$el.find('.list').height(this.listHeight);
        this.mScroll.refresh();
    },
    rotateItem: function(e){
        e.stopPropagation();
        if(!this.scrollEnd && e.target.classList.contains('back') && !this.swiping){
            var target = e.currentTarget,
                playerId = +target.getAttribute('data-id'),
                player = this.model.get(playerId);

            player.set({
                class: 'rotate'
            }, {silent: true});
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
        this.mScroll.scroll(-this.newItemHeight, 270);
        newItem.classList.remove('added');
        this.removedAdd = true;
    },
    editItem: function(e){
        e.stopPropagation();
        var target = e.currentTarget,
            playerEl = target.parentNode.parentNode,
            playerId = +playerEl.getAttribute('data-id'),
            player = this.model.get(playerId);
        player.set({
            class: '',
            name: playerEl.querySelector('.name').value
        }, {silent: true});
        playerEl.classList.remove('rotate')
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
        })
    }
}));