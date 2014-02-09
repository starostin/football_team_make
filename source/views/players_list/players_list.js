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
        'click .edit': 'editItem'
    },
    X: [],
    Y: [],
    pos: {},
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
        if(e){
            this.X.push(e.clientX);
            this.Y.push(e.clientY);
        }
//        if(this.X.length>=2 && this.X[0] !== this.X[1]){
//            this.removePlayer(e);
//            return;
//        }
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
        } else if(e && isNewAdded && (position <= this.newItemWidth)){
            console.log('-----------------------------ELSE---------------------------')
            var cosinus = (this.newItemWidth - Math.abs(position))/this.newItemWidth,
                deg = Math.acos(cosinus)*180/Math.PI;
            if(position > 0){
                deg = 0;
            }
            newItem.style.webkitTransform = 'rotateX(' + deg + 'deg)';
        }
    },
    onScrollStart: function(e){
        this.scrollStarted = true;
        this.moveLeft = e.origin.target.classList.contains('back');
        this.X.push(e.clientX);
        this.Y.push(e.clientY);
        console.log('-=------------------------------SCROLL START------------------------');
        console.log(e)
    },
    onScrollEnd: function(e){
        console.log('-=------------------------------SCROLL END------------------------');
        console.log(e)
        this.scrollEnd = this.scroll;
        var newItem = this.el.querySelector('.new-item'),
            scroll = this.mScroll,
            str = newItem.style.webkitTransform,
            a = str.split('('),
            b = a[1].split('deg'),
            deg = b[0];
        if(deg <= 10 && !newItem.classList.contains('added')){
            scroll.mTopOffset = 0;
            scroll.scrollPosition = scroll.scrollPosition - this.newItemWidth;
            newItem.style.webkitTransform = 'rotateX(0deg)';
            newItem.classList.add('added')
        }else if(+deg && newItem.classList.contains('added')){
            scroll.mTopOffset = -this.newItemWidth;
            scroll.scrollPosition = this.newItemWidth + scroll.scrollPosition;
            newItem.style.webkitTransform = 'rotateX(90deg)';
            newItem.classList.remove('added')
        }
        this.X = [];
        this.Y = [];
    },
    removePlayer: function(e){
        var item = e.origin.target.parentNode,
            style = item.style;
//        item.parentNode.style.position = 'relative';
//        style.position = 'relative';
//        style.right = this.X[0] - e.clientX + 'px';
        console.log('------------------------------REMOVE-------------------------')
        console.log(this.X[0] - e.clientX)
    },
    direction: function(e){
        console.log('-==--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        console.log(e.screenX)
        console.log(this.pos.X)
        return {
            top: e.clientY < this.pos.Y,
            left: e.clientX < this.pos.X,
            topDown: e.clientY !== this.pos.Y,
            leftRight: e.clientX !== this.pos.X
        }
    },
    rotateItem: function(e){
        e.stopPropagation();
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
    editItem: function(e){
        e.stopPropagation();
        var target = e.currentTarget,
            playerEl = target.parentNode.parentNode,
            index = +target.getAttribute('data-index'),
            player = this.model.at(index-1);
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