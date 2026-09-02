/* // The data model for car is as follows
{
    "model": "Corolla",
    "color": "Red",
    "age": 3
}
 */

let carArray = [];

let nextId = 1;

function getAll() {
  return carArray;
}

function addOne(carData) {
  // Check if any parameter is empty or undefined
  const { model, color, age } = carData;
  if (!model || !color || !age) {
    return false;
  }

  const newItem = {
    id: nextId++,
    ...carData,
  };

  carArray.push(newItem);
  return newItem;
}

function findById(id) {
  const numericId = Number(id);
  const item = carArray.find((item) => item.id === numericId);
  return item || false;
}

function updateOneById(id, updatedData) {
  const car = findById(id);
  if (car) {
    Object.assign(car, updatedData); // Update properties using Object.assign
    return car;
  }
  return false;
}

function deleteOneById(id) {
  const item = findById(id);
  if (item) {
    const initialLength = carArray.length;
    carArray = carArray.filter((item) => item.id !== Number(id));
    return carArray.length < initialLength; // Indicate successful deletion if the length has decreased
  }
  return false; // Return false if the item was not found
}

if (require.main === module) {
  // Add car
  let result = addOne({ model: "Corolla", color: "Red", age: 3 });
  console.log("result", result);
  console.assert(typeof result === 'object', 'Result should be an object');

  // Add another car
  result = addOne({ model: "Civic", color: "Blue", age: 2 });
  console.log(result);
  console.assert(typeof result === 'object', 'Result should be an object');

  // Get all cars
  const allCars = getAll();
  console.log("getAll called:", allCars);
  console.assert(Array.isArray(allCars), 'getAll should return an array');
  console.assert(allCars.length === 2, 'getAll should return an array of length 2');

  // Find car by ID
  const car = findById(1);
  console.log("findById called:", car);
  console.assert(typeof car === 'object', 'findById should return an object');

  // Update car by ID
  const updatedCar = updateOneById(1, { age: 4, color: "Black" });
  console.log("updateOneById called:", updatedCar);
  console.assert(typeof updatedCar === 'object', 'updateOneById should return an object');

  // Verify update
  const updatedCarCheck = findById(1);
  console.log("findById called after item updated:", updatedCarCheck);
  console.assert(updatedCarCheck.age === 4 && updatedCarCheck.color === "Black", 'Car should be updated');

  // Delete car by ID
  const deletedCar = deleteOneById(1);
  console.log("deleteOneById called:", deletedCar);
  console.assert(deletedCar === true, 'deleteOneById should return true');

  // Verify deletion
  const deletedCarCheck = findById(1);
  console.log("findById called after item deleted:", deletedCarCheck);
  console.assert(deletedCarCheck === false, 'Car should be deleted');
}

const Car = {
  getAll,
  addOne,
  findById,
  updateOneById,
  deleteOneById,
};

module.exports = Car;
