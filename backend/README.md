# eCommerce-API

A robust and scalable RESTful API for an eCommerce platform, built with Node.js, Express, and MongoDB.

## 📝 Description

This project provides the backend services for a modern eCommerce application. It includes a comprehensive set of features, from user authentication and product management to order processing and payment integration. The API is designed to be secure, efficient, and easy to integrate with any frontend application.

---

## 🌟 Features

- **Authentication**: Secure user registration and login with JWT-based authentication. It also supports OAuth with Google and Facebook.
- **User Management**: Full CRUD operations for users, including role-based authorization (user and admin).
- **Product Management**: Comprehensive product management, including CRUD operations, image uploads, and inventory tracking.
- **Category and Brand Management**: Organize products by categories, sub-categories, and brands.
- **Shopping Cart**: Persistent shopping cart functionality for authenticated users.
- **Wishlist**: Users can save products to a wishlist for future purchase.
- **Coupon Management**: Create and manage discount coupons.
- **Order Management**: A complete order processing workflow, from cart to checkout.
- **Payment Integration**: Seamless payment processing with Stripe.
- **Address Management**: Users can manage multiple shipping addresses.
- **Reviews and Ratings**: Users can leave reviews and ratings for products.
- **Advanced Querying**: Filter, sort, paginate, and search for products and other resources.

---

## ⚙️ Technologies

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **JWT (JSON Web Token)**: For secure user authentication.
- **Stripe**: For payment processing.
- **Passport.js**: For OAuth authentication (Google & Facebook).
- **Sharp**: For image processing and resizing.
- **Multer**: For handling file uploads.
- **Nodemailer**: For sending emails (e.g., password reset).

---

## 🛠️ Installation

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community)

---

### 🚀 Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ziadmorjan/ecommerse-api.git
   cd ecommerse-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `config.env` file**:
   Create a `config.env` file in the root directory and add the necessary environment variables. You can use the `config-lock.env` file as a template.

4. **Seed the database** (optional):
   You can use the seeder script to populate the database with dummy data.

   To ensure db is empty delete all data:

   ```bash
   node utils/dummyData/seeder.js -d
   ```

   Then

   ```bash
   node utils/dummyData/seeder.js -i
   ```

---

## ▶️ Run the Project

- **Development mode**:

  ```bash
  npm run start:dev
  ```

- **Production mode**:

  ```bash
  npm start
  ```

The server will start on the port specified in your `config.env` file (defaults to 8000).

---

## 🧭 API Endpoints

The API routes are defined in the `/routes` directory. Here's a summary of the main endpoints:

| Method | Endpoint               | Description                            |
| ------ | ---------------------- | -------------------------------------- |
| POST   | `/api/v1/auth/signup`  | Register a new user.                   |
| POST   | `/api/v1/auth/login`   | Login a user.                          |
| GET    | `/api/v1/products`     | Get all products.                      |
| POST   | `/api/v1/products`     | Create a new product (admin only).     |
| GET    | `/api/v1/products/:id` | Get a single product.                  |
| PATCH  | `/api/v1/products/:id` | Update a product (admin only).         |
| DELETE | `/api/v1/products/:id` | Delete a product (admin only).         |
| GET    | `/api/v1/cart`         | Get the logged-in user's cart.         |
| POST   | `/api/v1/cart`         | Add an item to the cart.               |
| DELETE | `/api/v1/cart/:id`     | Remove an item from the cart.          |
| GET    | `/api/v1/orders`       | Get all orders for the logged-in user. |
| POST   | `/api/v1/orders`       | Create a new order.                    |
| GET    | `/api/v1/orders/:id`   | Get a single order.                    |

... and many more. Refer to the files in the `routes` directory for a complete list of endpoints.

---

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `NODE_ENV`: `development` or `production`
- `PORT`: The port for the server to run on (e.g., `8000`)
- `DB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secret key for signing JWTs
- `JWT_EXPIRED`: The expiration time for JWTs (e.g., `90d`)
- `BASE_URL`: The base URL of your application (e.g., `http://localhost:8000`)
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `EMAIL_HOST`: Your email host (e.g., `smtp.gmail.com`)
- `EMAIL_PORT`: The port for your email host (e.g., `587`)
- `EMAIL_USER`: Your email address
- `EMAIL_PASS`: Your email password

---

## 🤝 Contributing

Contributions are welcome\! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENCE) file for more details.

---

## 🙏 Acknowledgements

- This project was developed by Ziad Morjan.
- Inspiration and guidance from various online tutorials and resources.
