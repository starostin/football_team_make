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
        'click .add-player': 'openAddPlayer',
        'click .add': 'addPlayer',
        'click .cancel': 'notAddPlayer',
        'click li': 'showPlayerInfo'
    },
    transitionOnce: 0,
    openAddPlayer: function(){
        console.log('=--=-==--=-=-=-=-=')
        var self = this,
            insertPoint = this.$el.find("li:nth-child(1)");
        console.log(insertPoint)

        $("<li />", {
            'text': "New Item",
            'class': "new-item animated flipInX"
        }).insertBefore(insertPoint);
        window.setTimeout(function(){
            console.log('++++++++++++++++++++++++++++')
            self.refreshScroll();
        }, 1000)
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