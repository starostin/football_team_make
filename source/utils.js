(function(){
    RAD.utils.createListStyles = function(rulePattern, rows, cols){
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
    }
})();