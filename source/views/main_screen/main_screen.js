RAD.view("view.main_screen", RAD.Blanks.View.extend({
    url: 'source/views/main_screen/main_screen.html',
    children: [
        {
            container_id: '.players-list',
            content: "view.players_list"
        }
    ],
    events: {
        'tap .footer': 'separateOnCommands'
    },
    separateOnCommands: function(){
        console.log('=---==-=--==-')
        RAD.models.players.allCombos = [];
        RAD.models.players.getCombos(RAD.models.players.toJSON(), 2, RAD.models.players.optionsForGetComb);
        console.log(RAD.models.players.allCombos.length);
        console.log(RAD.models.players.getCombinationsCount(2));
        RAD.models.players.separateOnCommands(RAD.models.players.allCombos, [3,3,3]);
    }
}));