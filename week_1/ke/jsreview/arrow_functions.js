
//regular function to arrow 
// function sayHello() {
//     return "Hello, world!";
// }

const sayHello = () => "Hello, world!";
console.log(sayHello());

//regular function to single parameter 
// function double(x) {
//     return x * 2;
// }

const double = x => x * 2;
console.log(double(5));

//reg func to multiple parameters
// function add(x, y) {
//     return x + y;
// }

const add = (x,y) =>{
    const sum = x + y;
    return sum;
}
console.log(add(3, 4));

//or 

const add2 = (x, y) => x + y;
console.log(add2(4, 4));

//refactor a function defined in an object
// const person = {
//     name: "Alice",
//     sayHi: function() {
//         return "Hi, " + this.name + "!";
//     }
// };

const personArrow = {
    name: "Alice",
    sayHi: () => "Hi, " + this.name + "!" // 'this' will not work as expected here
};
console.log(personArrow.sayHi()); // This will return "Hi, undefined!" because arrow functions do not have their own 'this'

//refactor a callback function passed to the map method
// const numbers = [1, 2, 3, 4, 5];

// const doubled = [];
// numbers.forEach(function(num) {
//   doubled.push(num * 2);
// });

const numbers = [1, 2, 3, 4, 5];
const doubled = [];

numbers.forEach(num =>  doubled.push(num * 2));
console.log(doubled); 

//PART 2 - Hoisting

// function declaration
function square(x) {
  return x * x;
}

// function expression
const square = function(x) {
  return x * x;
};

//continue in separate file for hoisting examples > hoisting.js

