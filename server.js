// Import the Express.js framework. Express is a minimalist web framework for Node.js
// that simplifies building web applications and APIs.
const express = require('express');

// Create an instance of the Express application.
const app = express();

// Define the port number on which the server will listen.
// It will try to use the port defined in environment variables (for deployment)
// or default to 3000 if not specified.
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies from incoming requests.
// This is essential for handling POST and PUT requests where data is sent in JSON format.
app.use(express.json());

// --- Simple In-Memory Data Store ---
// In a real-world application, this would be a database (e.g., MongoDB, PostgreSQL, MySQL).
// For simplicity, we'll use an array to store our 'items'.
let items = [
  { id: 1, name: 'Item A', description: 'Description for Item A' },
  { id: 2, name: 'Item B', description: 'Description for Item B' },
  { id: 3, name: 'Item C', description: 'Description for Item C' },
];

// --- Helper function to generate a unique ID ---
// This is a simple way to get a new ID. In a database, IDs are usually auto-generated.
const generateId = () => {
  const maxId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0;
  return maxId + 1;
};

// --- API Routes ---

// 1. GET /api/items - Get all items
// This route handles GET requests to '/api/items' and returns the entire list of items.
app.get('/api/items', (req, res) => {
  console.log('GET /api/items - All items requested');
  res.status(200).json(items); // Send a 200 OK status and the items array as JSON.
});

// 2. GET /api/items/:id - Get a single item by ID
// This route handles GET requests to '/api/items/:id' where ':id' is a URL parameter.
app.get('/api/items/:id', (req, res) => {
  // Extract the ID from the URL parameters. `parseInt` converts the string ID to a number.
  const id = parseInt(req.params.id);
  // Find the item in the array that matches the given ID.
  const item = items.find(i => i.id === id);

  if (item) {
    console.log(`GET /api/items/${id} - Item found:`, item);
    res.status(200).json(item); // Send the found item.
  } else {
    console.log(`GET /api/items/${id} - Item not found`);
    res.status(404).send('Item not found'); // Send a 404 Not Found status if item doesn't exist.
  }
});

// 3. POST /api/items - Create a new item
// This route handles POST requests to '/api/items' to add a new item.
// The new item data is expected in the request body as JSON.
app.post('/api/items', (req, res) => {
  // Check if the request body contains a 'name' property, which is required for a new item.
  if (!req.body.name) {
    console.log('POST /api/items - Missing name in request body');
    // Send a 400 Bad Request status if 'name' is missing.
    return res.status(400).send('Name is required to create an item.');
  }

  // Create a new item object with a generated ID and data from the request body.
  const newItem = {
    id: generateId(),
    name: req.body.name,
    description: req.body.description || 'No description provided', // Optional description
  };

  // Add the new item to our in-memory array.
  items.push(newItem);
  console.log('POST /api/items - New item created:', newItem);
  // Send a 201 Created status and the newly created item as JSON.
  res.status(201).json(newItem);
});

// 4. PUT /api/items/:id - Update an existing item
// This route handles PUT requests to '/api/items/:id' to update an item.
// The updated data is expected in the request body as JSON.
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Find the index of the item to be updated.
  const itemIndex = items.findIndex(i => i.id === id);

  if (itemIndex !== -1) {
    // If the item exists, update its properties.
    // We use the spread operator to merge existing properties with new ones from the body.
    items[itemIndex] = {
      ...items[itemIndex], // Keep existing properties
      name: req.body.name || items[itemIndex].name, // Update name if provided, else keep old
      description: req.body.description || items[itemIndex].description, // Update description if provided, else keep old
    };
    console.log(`PUT /api/items/${id} - Item updated:`, items[itemIndex]);
    res.status(200).json(items[itemIndex]); // Send the updated item.
  } else {
    console.log(`PUT /api/items/${id} - Item not found for update`);
    res.status(404).send('Item not found'); // Send 404 if item doesn't exist.
  }
});

// 5. DELETE /api/items/:id - Delete an item
// This route handles DELETE requests to '/api/items/:id' to remove an item.
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Filter out the item with the given ID to effectively delete it.
  const initialLength = items.length;
  items = items.filter(i => i.id !== id);

  if (items.length < initialLength) {
    console.log(`DELETE /api/items/${id} - Item deleted`);
    res.status(204).send(); // Send a 204 No Content status for successful deletion.
  } else {
    console.log(`DELETE /api/items/${id} - Item not found for deletion`);
    res.status(404).send('Item not found'); // Send 404 if item doesn't exist.
  }
});

// --- Start the server ---
// The app.listen method starts the server and makes it listen for incoming connections
// on the specified port.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}/api/items`);
  console.log('Use tools like Postman, Insomnia, or curl to test the endpoints.');
});