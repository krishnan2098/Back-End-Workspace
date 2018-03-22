function average(scoresArray) {
    var Total = 0
    var AvgScore = 0;
    scoresArray.forEach(function(score){
        Total = Total + score;
    });
    
    AvgScore = Total/scoresArray.length;
    
    return Math.round(AvgScore);
    }
    

var scores = [90, 98, 89, 100, 100, 86, 94];
console.log(average(scores));
var scores2 = [40, 65, 77, 82, 80, 54, 73, 63, 95, 49];
console.log(average(scores2));