import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import express from 'express';
import mongoose from 'mongoose';
import { buildAuthenticatedRouter } from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { usersSchema } from "./users.js";
import { citiesSchema } from "./cities.js";

const PORT = 3000;

// Initialize Mongoose with a MongoDB database connection
mongoose.connect('mongodb://localhost:27017/adminjs_example', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a User model
const Users = mongoose.model("Users", usersSchema);
const Cities = mongoose.model("Cities", citiesSchema);


// Default admin credentials
const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

// Function to authenticate users
const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return DEFAULT_ADMIN; // Return the user object
  }
  return null; // Return null if authentication fails
};

// Start function to initialize AdminJS and Express
const start = async () => {
  const app = express();

  // Register Mongoose adapter with AdminJS
  AdminJS.registerAdapter(AdminJSMongoose);

  // Initialize AdminJS
  const admin = new AdminJS({
    databases: [mongoose],
    rootPath: '/admin',
    resources: [
        {resource: Users},
        {resource: Cities}    
    ],
  });

  // Build authenticated AdminJS router with session-based authentication
  const adminRouter = buildAuthenticatedRouter(admin, {
    authenticate,
    cookieName: 'adminjs',
    cookiePassword: 'sessionsecret',
  });

  app.use(admin.options.rootPath, adminRouter);

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
  });
};

start();
