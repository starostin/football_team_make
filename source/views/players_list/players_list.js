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
        'click .cancel': 'removeAdd'
    },
    listHeight: 0,
    onInitialize: function(){
        this.model = RAD.models.players;
    },
    onStartAttach: function(){
        this.createListStyles(".list li:nth-child({0})", 50, 1);
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
    onScroll: function(posit, type, e){
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
                this.listHeight = this.listHeight - 150;
                this.$el.find('.list').height(this.listHeight);
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
            this.listHeight = this.listHeight + 150;
            this.$el.find('.list').height(this.listHeight);
            this.updateListHeight = true;
        }
    },
    onSwipe: function(e, index){
        if(!e || !index){
            return;
        }
        var item = this.el.querySelector('[data-index="' + index +'"]'),
            style = item.style;

        style.webkitTransform = 'translate3d(-' + (scroll.X[0] - e.clientX) + 'px, 0, 0)';
    },
    onSwipeStart: function(e){
    },
    onSwipeEnd: function(e, index){
        var self = this,
            item = this.el.querySelector('[data-index="' + index +'"]'),
            fromRight = item.getBoundingClientRect().right,
            width = item.getBoundingClientRect().width,
            playerId = +item.getAttribute('data-id'),
            player = this.model.get(playerId),
            overlay = document.querySelector('#overlay'),
            removedLi = $(item).closest("li"),
            top = removedLi.offset().top - 40,
            fakeEl = this.el.querySelector('.fake');
        console.log(top)

        overlay.classList.add('show');
        this.swiping = true;
        item.style.webkitTransform = '';
        if(width - fromRight > 200){
            item.classList.add('swipe_left');
            item.addEventListener('webkitTransitionEnd', function(){
                self.model.remove(player, {silent: true});
                fakeEl.style.top = top + 'px';
                fakeEl.style.opacity = 1;
                removedLi.remove();
                removedLi.on('webkitTransitionEnd', function(){
                    overlay.classList.remove('show');
                    self.swiping = false;
                    self.listHeight = self.listHeight - 150;
                    self.$el.find('.list').height(self.listHeight);
                    var scrollTo = self.mScroll.scrollPosition;
                    self.mScroll.refresh();
                    self.mScroll.setPosition(scrollTo)
                })
            })
        }else{
            item.classList.add('swipe_right');
            item.addEventListener('webkitTransitionEnd', function(){
                overlay.classList.remove('show');
                item.classList.remove('swipe_right');
                self.swiping = false;
            });
        }
    },
    rotateItem: function(e){
        e.stopPropagation();
        if(!this.scrollEnd && e.target.classList.contains('back') && !this.swiping){
            var target = e.currentTarget,
                playerId = +target.getAttribute('data-id'),
                player = this.model.get(playerId);

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
                    id: parseInt(Math.random()*100),
                    name: 'oleg',
                    rate: 8,
                    class: ''
                });
            self.$el.find('.list').height(self.listHeight);
            self.mScroll.refresh()
        })
    }
}));