// 1.
// function cube(x) {
//   return x * x * x;
// }

const cube = function(x) {
  return x * x * x;
}

// 2.
// function fullName(first, last) {
//   return first + " " + last;
// }

const fullName = function(first, last) {
  return first + " " + last;
}

// 3.
// function power(base, exp) {
//   if (exp === 0) {
//     return 1;
//   }
//   return base * power(base, exp - 1);
// }

const power = function(base, exp) {
  if (exp === 0) {
    return 1;
  }
  return base * power(base, exp - 1);
}

// 4.
// function sumCubes(numbers) {
//   let total = 0;
//   for (let i = 0; i < numbers.length; i++) {
//     total = total + cube(numbers[i]);
//   }
//   return total;
// }

const sumCubes = function(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total = total + cube(numbers[i]);
  }
  return total;
}

//Mechnics of Hoisting

//Why does JavaScript output undefined instead of throwing an error in the following code? Answer: because of hoisting, the variable declared was not returned? 
//Researched answer: Because var declarations are hoisted to the top of their scope and initialized with undefined. The assignment happens later, so console.log(message) outputs undefined.
console.log(message);

var message = 'Hi there!';

// Why does JavaScript throw an error instead of logging undefined in the following code? Answer: because let variables are hoisted but not initialized, accessing them before declaring results in an error specfically reference errror. 
//Researched answer: let declarations are hoisted, but they are not initialized. The variable remains in the Temporal Dead Zone (TDZ) until the declaration is reached. Accessing it before that point causes a ReferenceError.
console.log(message);

let message = 'Hi there!';

//Explain precisely what happens when the following code is executed. Answer: it doesnt show anything on the console when it runs, i think because the function is not declared before it's being called? 
//Researched answer: showMessage is called before it is defined. In JavaScript, function declarations are hoisted, so the function can be called before its definition. However, in this case, showMessage is defined as a function expression (assigned to a variable), which is not hoisted in the same way. Therefore, calling showMessage before its definition results in a TypeError because showMessage is undefined at that point.
console.log(showMessage());

const showMessage = function(){
  return 'Hi there!';
};

//Why does JavaScript not throw any errors when the following code is executed? Answer: because of the same thing from above? lol , oop i'm wrong
//Researched answer: This works because function declarations are hoisted along with the function itself. Because of this, the function can be called before its definition in the code, and it will still work correctly. The function is hoisted to the top of its scope, allowing it to be invoked before its actual declaration in the code.
console.log(showMessage());

function showMessage(){
  return 'Hi there!';
}

//CODE RESTRUCTING
// 1.
// for(let i = 0; i < values.length; i++){
//   console.log(values[i]);
// }

// let values = [10, 20, 30];

//let values are being accessed before intialization, so just gotta move them up :). 

let values = [10, 20, 30];

for(let i = 0; i < values.length; i++){
  console.log(values[i]);
}

// 2.
// console.log(welcome('Charlie', 'Munger'));

// function welcome(first, last) {
//   return `Welcome, ${first} ${last}! You last logged in on ${lastLogin}.`
// };

// let lastLogin = '1/1/1970';

//similar to above, let lastLogin is being accessed before initialization, so just move it up.
let lastLogin = '1/1/1970';

console.log(welcome('Charlie', 'Munger'));

function welcome(first, last) {
  return `Welcome, ${first} ${last}! You last logged in on ${lastLogin}.`
};



