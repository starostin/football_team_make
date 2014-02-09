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
        'click ul .item': 'rotateItem'
    },
    onInitialize: function(){
        this.model = RAD.models.players;
    },
    onEndRender: function(){
        var newItem = this.el.querySelector('.new-item');
        newItem.style.webkitTransform = 'rotateX(90deg)';
        newItem.style.webkitTransformOrigin =  '50% 100%';
    },
    newItemWidth: 150,
    onScroll: function(posit, type, e){
        console.log('-=------------------------------SCROLL MOVE------------------------');
        console.log(e)
        if(this.scrollStarted){
            this.scroll = e;
        }
        var newItem = this.el.querySelector('.new-item'),
            position = posit>> 0,
            isNewAdded = this.el.querySelector('.added');

        if (!isNewAdded) {
            var cosinus = (position)/this.newItemWidth,
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position > this.newItemWidth){
                deg = 0;
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
        } else if(isNewAdded && (type === 'move') && !this.flag && (position <= this.newItemWidth)){
            var cosinus = (this.newItemWidth - Math.abs(position))/this.newItemWidth,
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position > 0){
                deg = 0;
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
            this.itemAdded = false;
        }
        if(this.flag){
            this.flag = false;
        }
        this.pos = position;
    },
    onScrollStart: function(e){
        this.scrollStarted = true;
        console.log('-=------------------------------SCROLL START------------------------');
        console.log(e)
    },
    onScrollEnd: function(e){
        console.log('-=------------------------------SCROLL END------------------------');
        console.log(e)
        this.scrollEnd = this.scroll;
        var newItem = this.el.querySelector('.new-item'),
            scroll = this.mScroll;
        if(!this.itemAdded){
            var str = newItem.style.webkitTransform,
                a = str.split('('),
                b = a[1].split('deg'),
                deg = b[0];

            if(deg <= 10 && !newItem.classList.contains('added')){
                this.itemAdded = true;
                this.flag = true;
                scroll.mTopOffset = 0;
                scroll.scrollPosition = scroll.scrollPosition - this.newItemWidth;
                newItem.style.webkitTransform = 'rotateX(0deg)';
                newItem.classList.add('added')
            }else if(+deg && newItem.classList.contains('added')){
                this.itemAdded = false;
                scroll.mTopOffset = -this.newItemWidth;
                scroll.scrollPosition = this.newItemWidth + scroll.scrollPosition;
                newItem.style.webkitTransform = 'rotateX(90deg)';
                newItem.classList.remove('added')
            }
        }
//        this.scroll = false;
    },
    directionForward: function(pos){
        return pos >= this.pos
    },
    rotateItem: function(e){
        if(!this.scrollEnd && e.target.classList.contains('back')){
            var target = e.currentTarget,
                index = +target.getAttribute('data-index'),
                player = this.model.at(index);
            console.log('-------------------------------------------');
            console.log(e)
            player.set({
                class: 'rotate'
            }, {silent: true})
            target.classList.add('rotate')
        }

    },
    addPlayer: function(){
        var self = this,
            addedItem = this.el.querySelector('.added');
//        addedItem.style.webkitTransition = '5s';
        addedItem.classList.add('rotate');
        addedItem.addEventListener('webkitTransitionEnd', function(){
            console.log('-=-=-=-=-=-=-=-=-=-==--=-=-=')
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