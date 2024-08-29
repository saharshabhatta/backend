# Project Setup and API Documentation

## Prerequisites

Before you begin, ensure that you have the following installed:

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)
- **MongoDB** (Ensure MongoDB is running locally or provide a connection string)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project directory and configure the following environment variables:

```
DB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

### 4. Start the Application

To start the NestJS application, run:

```bash
npm run start:dev
```

The application will be running on `http://localhost:3000`.

### 5. Access the API Documentation

NestJS automatically generates API documentation using Swagger. To access the API documentation:

1. Ensure the application is running.
2. Open your browser and navigate to: `http://localhost:3000/api/docs/`

You will see the Swagger UI where you can explore and test the available API endpoints.

## Additional Commands

- **Run in Production**: `npm run start:prod`
- **Run Tests**: `npm run test`
