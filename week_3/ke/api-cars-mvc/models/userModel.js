/* // The data model for user is as follows
{
    "name": "Matti Seppänen",
    "password": "M@45mtg$",
    "username": "mattis",
    "address": "Mannerheimintie 14, 00100 Helsinki",	
    "age": 23
}
 */

let userArray = [];

let nextId = 1;

function getAll() {
  return userArray;
}

function addOne(userData) {
  // Check if any parameter is empty or undefined
  const { name, password, username, address, age } = userData;
  if (!name || !password || !username || !address || !age) {
    return false;
  }

  const newItem = {
    id: nextId++,
    ...userData,
  };

  userArray.push(newItem);
  return newItem;
}

function findById(id) {
  const numericId = Number(id);
  const item = userArray.find((item) => item.id === numericId);
  return item || false;
}

function updateOneById(id, updatedData) {
  const user = findById(id);
  if (user) {
    Object.assign(user, updatedData); // Update properties using Object.assign
    return user;
  }
  return false;
}

function deleteOneById(id) {
  const item = findById(id);
  if (item) {
    const initialLength = userArray.length;
    userArray = userArray.filter((item) => item.id !== Number(id));
    return userArray.length < initialLength; // Indicate successful deletion if the length has decreased
  }
  return false; // Return false if the item was not found
}

if (require.main === module) {
  // Add user
  let result = addOne({
    name: "John Doe",
    password: "password123",
    username: "johndoe",
    address: "123 Main St",
    age: 30,
  });
  console.log("result", result);
  console.assert(typeof result === 'object', 'Result should be an object');

  // Add another user
  result = addOne({
    name: "Jane Smith",
    password: "password456",
    username: "janesmith",
    address: "456 Elm St",
    age: 25,
  });
  console.log(result);
  console.assert(typeof result === 'object', 'Result should be an object');

  // Get all users
  const allUsers = getAll();
  console.log("getAll called:", allUsers);
  console.assert(Array.isArray(allUsers), 'getAll should return an array');
  console.assert(allUsers.length === 2, 'getAll should return an array of length 2');

  // Find user by ID
  const user = findById(1);
  console.log("findById called:", user);
  console.assert(typeof user === 'object', 'findById should return an object');

  // Update user by ID
  const updatedUser = updateOneById(1, { age: 31, address: "789 Oak St" });
  console.log("updateOneById called:", updatedUser);
  console.assert(typeof updatedUser === 'object', 'updateOneById should return an object');

  // Verify update
  const updatedUserCheck = findById(1);
  console.log("findById called after item updated:", updatedUserCheck);
  console.assert(updatedUserCheck.age === 31 && updatedUserCheck.address === "789 Oak St", 'User should be updated');

  // Delete user by ID
  const deletedUser = deleteOneById(1);
  console.log("deleteOneById called:", deletedUser);
  console.assert(deletedUser === true, 'deleteOneById should return true');

  // Verify deletion
  const deletedUserCheck = findById(1);
  console.log("findById called after item deleted:", deletedUserCheck);
  console.assert(deletedUserCheck === false, 'User should be deleted');
}

const User = {
  getAll,
  addOne,
  findById,
  updateOneById,
  deleteOneById,
};

module.exports = User;
