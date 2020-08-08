var today = new Date();
var startingDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
var arr = [];
var thisDay = new Date();
for(var i=0; i<7; i++) {
  thisDay.setDate(startingDay.getDate() + i);
  arrayName = thisDay.toISOString().substring(0, 10);
  arr.push(arrayName);
}
console.log(arr);

arr = []
arr.Name = "abc"
console.log(Object.keys({arr})[0]);


// Date.prototype.yyyymmdd = function() {
//     var mm = this.getMonth() + 1; // getMonth() is zero-based
//     var dd = this.getDate();
  
//     return [this.getFullYear(),
//             (mm>9 ? '' : '0') + mm,
//             (dd>9 ? '' : '0') + dd
//            ].join('');
//   };
  
//   var date = new Date();
//   console.log(date.yyyymmdd());

// var today = new Date();
// console.log(today.toISOString().substring(0, 10));
// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();

// today = yyyy + '-' + mm + '-' + dd;
// console.log(today);