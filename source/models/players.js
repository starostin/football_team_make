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
    model: RAD.models.Player,
    optionsForComb: {},
    optionsForGetComb: {},
    maxCombinations: 200000,
    combCounter: 0,
    allCombos: [],
    factorial: function(number){
        var factorial = 1;
        for (var i = 1; i <= number; i++){
            factorial *= i;
        }
        return factorial;
    },
    prepareArray: function(people){
        var res = [], arr = [], c = 0;
        for(var i=0; i<people-1; i++){
            arr = [];
            c=0;
            for(var j=0; j<this.toJSON().length-people+1; j++){
                c = i+j+2;
                arr.push(c);
            }

            res.push(arr);
        }
        return res;
    },
    count: function(stack, history) {
        var self = this,
            counter = 0;
        history = history || [];
        stack[0].forEach(function(it) {
            if (! history.length || history[history.length -1] < it) {
                if (stack[1]) {
                    counter += self.count(stack.slice(1), history.concat([it]));
                } else  {
                    counter++;
                }
            }
        });
        return counter;
    },
    getCombinationsCount: function(people){
        var playersCount = this.toJSON().length;
        var arr = this.prepareArray(people),
            count = this.count(arr);

        return (count*this.factorial(playersCount - people))/(this.factorial(playersCount - people - people) * this.factorial(people))
    },
    k_combinations: function(superset, size, options, first, flag) {
        var result = [];
        if (superset.length < size) {return result;}
        var done = false;
        var current_combo, distance_back, new_last_index;
        var indexes = [];
        if(options.current_combo){
            current_combo = this.optionsForComb.current_combo;
            distance_back = this.optionsForComb.distance_back;
            new_last_index = this.optionsForComb.new_last_index;
            indexes = this.optionsForComb.indexes;
        }
        var indexes_last = size - 1;
        var superset_last = superset.length - 1;

        // initialize indexes to start with leftmost combo
        if(!options.current_combo || flag){
            for (var i = 0; i < size; ++i) {
                indexes[i] = i;
            }
        }

        while (!done) {
            if(this.combCounter === this.maxCombinations){
                this.combCounter = 0;
                this.optionsForComb.current_combo = current_combo;
                this.optionsForComb.distance_back = distance_back;
                this.optionsForComb.new_last_index = new_last_index;
                this.optionsForComb.indexes = indexes;
                return false;
            }
            this.combCounter++;
            current_combo = [];
            for (i = 0; i < size; ++i) {
                current_combo.push(superset[indexes[i]]);
            }
            try{
                var ends = _.filter(this.toJSON(), function(obj){ return !_.findWhere(first.concat(current_combo), obj); })
            }catch(e){
                console.log('---------------------end---------------------')
                return;
            }
            this.allCombos.push(first.concat(current_combo).concat(ends));
            result.push(current_combo);
            if (indexes[indexes_last] == superset_last) {
                done = true;
                for (i = indexes_last - 1; i > -1 ; --i) {
                    distance_back = indexes_last - i;
                    new_last_index = indexes[indexes_last - distance_back] + distance_back + 1;
                    if (new_last_index <= superset_last) {
                        indexes[indexes_last] = new_last_index;
                        done = false;
                        break;
                    }
                }
                if (!done) {
                    ++indexes[indexes_last - distance_back];
                    --distance_back;
                    for (; distance_back; --distance_back) {
                        indexes[indexes_last - distance_back] = indexes[indexes_last - distance_back - 1] + 1;
                    }
                }
            }
            else {++indexes[indexes_last]}
        }
        return true;
    },
    getCombos: function(players, people, options) {
        var arr = [],
            gone = false,
            len = players.length,
            smallArr = [],
            i = 1, flag = false;
        for(var t=0; t<people; t++){
            arr.push(t);
        }
        if(options.arr){
            arr = this.optionsForGetComb.arr;
            i = this.optionsForGetComb.i;
        }

        for (i; i < len; i++) {
            arr[arr.length - 1] = arr[arr.length - 2] + i;
            smallArr = [];
            for(var c=0; c<arr.length; c++){
                smallArr.push(players[arr[c]])
            }
            var temp = [];
            temp = players.slice(0);
            var removeValFromIndex = arr;
            for (var v = 0; v<removeValFromIndex.length; v++){
                temp[removeValFromIndex[v]] = null;
            }
            var d = _.compact(temp);
            var combos = this.k_combinations(d, players.length-2*people, this.optionsForComb, smallArr, flag);
            if(!combos){
                this.optionsForGetComb.arr = arr;
                this.optionsForGetComb.i = i;
                flag=false;
                return;
            }else{
                flag = true;
            }
            for (var index = 1; index < 3; index++) {
                if(arr[1] === len-1){
                    gone = true;
                    break;
                }
                if (arr[arr.length - index] === len-1) {
                    arr[arr.length - index - 1] = arr[arr.length - index - 1] + 1;
                    i = 0;
                    arr[arr.length - index] = arr[arr.length - index - 1] + 1;
                    this.optionsForGetComb.arr = arr;
                }
            }
            for (var step = 3, z=1; step < arr.length-1; step++, z++) {
                if(arr[1] === len-step-1){
                    gone = true;
                    break;
                }
                if (arr[arr.length - step] === len-z-1) {
                    arr[arr.length - step - 1] = arr[arr.length - step - 1] + 1;
                    i = 0;
                    for(var j=step; j>1; j--){
                        arr[arr.length - j] = arr[arr.length - j - 1] + 1;
                    }
                }
            }
            if(gone){
                break;
            }
        }
    },
    separateOnCommands: function(total, commands) {
        if(!total || !total.length || !commands || !commands.length){
            return;
        }
        var separatedCommands = [], commonRate = 0, alm = 0, mostSuitable;
        for (var i = 0; i < total.length; i++) {
            var summary = [];
            alm = 0;
            for (var j = 0; j < commands.length; j++) {
                summary[j] = _.first(total[i], +commands[j]);
                total[i].splice(0, +commands[j]);
                commonRate = _.reduceRight(summary[j], function(memo, num){return memo+num.rate}, 0);
                alm = alm + Math.abs((this.totalRate(this.toJSON())/commands.length)/commonRate);
            }
            summary.diff = +((+(+alm/commands.length - 1).toFixed(4))*100).toFixed(2);
            separatedCommands.push(summary);
        }
        separatedCommands.sort(function(a,b){return a.diff-b.diff});
        mostSuitable = this.getMostSuitable(newArr);
        separatedCommands.length = mostSuitable;
        return separatedCommands;
    },
    totalRate: function(players){
        if(!players || !players.length){
            return;
        }
        var total = 0;
        for(var i=0; i<players.length; i++){
            total = players[i].rate + total;
        }
        return total;
    },
    getMostSuitable: function(allVariants){
        for(var i=0; i<allVariants.length; i++){
            if(allVariants[i].diff!==allVariants[i+1].diff)
                break;
        }
        return i+1;
    }
}), false);
RAD.model('players', RAD.models.Players);