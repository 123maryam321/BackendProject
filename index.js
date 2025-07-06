const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to the Node.js API — deployed on Render! This is maryam Azhar');
});

// Static User Info
const apiPath = "/api/users";
app.get(apiPath, (req, res) => {
  res.json({
    name: 'Maryam',
    email: 'Maryam25azhar@gmail.com',
    age: 26,
    city: 'Karachi',
    country: 'Pakistan'
  });
});

// External API Route (Chori)
const myChoriApi = "/ali-self-medication";
const externalURL =
"https://apidb.dvago.pk/AppAPIV3/GetProductBannersBySlugV1&Slug=AppHomePageProductCarouselOne&BranchCode=48&ProductID=&limit=0,10";

app.get(myChoriApi, async (req, res) => {
  try {
    const response = await axios.get(externalURL);
    res.json({
      message: "Chori retrieved successfully",
      myChori: response.data
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Chori data",
      error: error.message
    });
  }
});

// In-Memory User List
const myJson = "/json-api";
const data = [
  { id: 1, name: 'Anas', email: 'anas@gmail.com' },
  { id: 2, name: 'Ali', email: 'ali@gmail.com' },
  { id: 3, name: 'Ahmed', email: 'ahmed@gmail.com' }
];

// GET All Users
app.get(myJson, (req, res) => {
  res.json({
    message: "Users retrieved successfully",
    myUsers: data
  });
});

// POST: Add New User
app.post(myJson, (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
        error: "Missing required fields"
      });
    }

    const newUser = {
      id: data.length + 1,
      name,
      email
    };

    data.push(newUser);

    res.status(201).json({
      message: "User added successfully",
      newUser,
      totalUsers: data.length
    });

  } catch (error) {
    res.status(500).json({
      message: "Error adding user",
      error: error.message
    });
  }
});

// PUT: Replace Existing User
app.put(`${myJson}/:id`, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    const userIndex = data.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
        error: "User with this ID does not exist"
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        message: "PUT requires all fields (name and email)",
        error: "Missing required fields for complete resource replacement",
        note: "PUT replaces the entire resource, so all fields are required"
      });
    }

    const updatedUser = {
      id: userId,
      name,
      email
    };

    data[userIndex] = updatedUser;

    res.json({
      message: "User completely replaced (PUT)",
      updatedUser,
      note: "PUT replaced the entire resource with new data"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
});

// PATCH: Partially Update User
app.patch(`${myJson}/:id`, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    const userIndex = data.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
        error: "User with this ID does not exist"
      });
    }

    if (!name && !email) {
      return res.status(400).json({
        message: "PATCH requires at least one field to update",
        error: "No fields provided for update",
        note: "PATCH allows partial updates, so at least one field should be provided"
      });
    }

    const currentUser = data[userIndex];
    const updatedUser = {
      ...currentUser,
      ...(name && { name }),
      ...(email && { email })
    };

    data[userIndex] = updatedUser;

    res.json({
      message: "User partially updated (PATCH)",
      updatedUser,
      changes: {
        name: name ? `Changed from "${currentUser.name}" to "${name}"`
: "No change",
        email: email ? `Changed from "${currentUser.email}" to
"${email}"` : "No change"
      },
      note: "PATCH updated only the provided fields, keeping other fields unchanged"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
});

// Server Listener
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;