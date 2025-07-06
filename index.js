const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.get('/', (req, res) => {
  res.send('🚀 Welcome to the Node.js API — deployed on Render! This is Maryam Azhar');
});



const data = [
  { id: 1, description: 'Sleep' },
  { id: 2, description: 'Pray' },
  { id: 3, description: 'Eat' }
];

// GET All Todo's
const myGet = "/maryam-get-api";
app.get(myGet, (req, res) => {
  res.json({
    message: "Todo's retrieved successfully",
    myTodo: data
  });
});


// POST: Add New Todo
const myPost = "/maryam-post-api";
app.post(myPost, (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        message: "Description required",
        error: "Missing required fields"
      });
    }

    const newTodo = {
      id: data.length + 1,
      description
    };

    data.push(newTodo);

    res.status(201).json({
      message: "TODO added successfully",
      newTodo,
      totalTodo: data.length
    });

  } catch (error) {
    res.status(500).json({
      message: "Error adding TODO",
      error: error.message
    });
  }
});

// PUT: Replace Todo
const myPut = "/maryam-put-api";
app.put(`${myPut}/:id`, (req, res) => {
  try {
    const TodoID = parseInt(req.params.id);
    const { description } = req.body;

    const todoIndex = data.findIndex(user => user.id === TodoID);

    if (todoIndex === -1) {
      return res.status(404).json({
        message: "TODO not found",
        error: "TODO with this ID does not exist"
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "PUT requires all fields (description)",
        error: "Missing required fields for complete resource replacement",
        note: "PUT replaces the entire resource, so all fields are required"
      });
    }

    const updatedTodo = {
      id: TodoID,
      description
    };

    data[todoIndex] = updatedTodo;

    res.json({
      message: "TODO completely replaced (PUT)",
      updatedTodo,
      note: "PUT replaced the entire resource with new data"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating TODO",
      error: error.message
    });
  }
});

// PATCH: Partially Update Todo
const myPatch = "/maryam-patch-api";
app.patch(`${myPatch}/:id`, (req, res) => {
  try {
    const TodoID = parseInt(req.params.id);
    const { description } = req.body;

    const todoIndex = data.findIndex(user => user.id === TodoID);

    if (todoIndex === -1) {
      return res.status(404).json({
        message: "TODO not found",
        error: "TODO with this ID does not exist"
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "PATCH requires at least one field to update",
        error: "No fields provided for update",
        note: "PATCH allows partial updates, so at least one field should be provided"
      });
    }

    const currentTodo = data[todoIndex];
    const updatedTodo = {
      ...currentTodo,
      ...(description && { description })
    };

    data[todoIndex] = updatedTodo;

    res.json({
      message: "TODO partially updated (PATCH)",
      updatedTodo,
      changes: {
        description: description ? `Changed from "${currentTodo.description}" to "${description}"` : "No change"
      },
      note: "PATCH updated only the provided fields, keeping other fields unchanged"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating TODO",
      error: error.message
    });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;