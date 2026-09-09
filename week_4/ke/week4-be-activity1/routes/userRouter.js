const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  // patchUser
} = require("../controllers/userController");
 
// GET /users
router.get("/", getAllUsers);

// POST /users
router.post("/", createUser);

// GET /users/:userId
router.get("/:userId", getUserById);

// PUT /users/:userId
router.put("/:userId", updateUser);

// DELETE /users/:userId
router.delete("/:userId", deleteUser);

// Update user using PATCH 
// router.patch('/:userId', patchUser)

module.exports = router;


