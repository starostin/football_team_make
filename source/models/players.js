/**
 * Created with JetBrains PhpStorm.
 * User: user
 * Date: 2/4/14
 * Time: 3:07 PM
 * To change this template use File | Settings | File Templates.
 */
// Category Model
RAD.model('Player', Backbone.Model.extend({
    defaults: {
        "id": 0,
        "name": "",
        "rate": ""
    }
}), false);

// Collection of Categories
RAD.model('Players', Backbone.Collection.extend({
    model: RAD.models.Player
}), false);
RAD.model('players', RAD.models.Players);