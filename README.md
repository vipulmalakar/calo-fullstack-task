# Calo Fullstack Task

This project is a full-stack application that includes a backend built with NestJS and a frontend built with Next.js. The application allows users to create jobs that fetch random images from Unsplash and display them.

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 7 or higher)

### Backend Setup

1. Copy the example environment file:
   ```sh
   cp backend/.env.example backend/.env
   ```
2. Update `backend/.env` with your configuration.

3. Install dependencies and start the backend server:

    ```bash
    cd backend
    npm install
    npm run start
    ```

### Frontend Setup

1. Copy the example environment file:
   ```sh
   cp frontend/.env.example frontend/.env
   ```
2. Update `frontend/.env` with your configuration.

3. Install dependencies and start the frontend server:

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Running the Application

1. Ensure both the backend and frontend servers are running.
2. Open your browser and navigate to `http://localhost:3000` to access the frontend application.

### Notes

- Make sure to replace `your_unsplash_access_key_here` with your actual Unsplash access key.
- The backend server runs on port `5000` and the frontend server runs on port `3000` by default. You can change these ports by updating the `.env` files accordingly.

## Time Report

### Sections and Time Spent

1. **Initial Setup and Project Structure**: 1 hour
   - Setting up the initial project structure for both frontend and backend.
   - Installing necessary dependencies.

2. **Backend Development**: 3 hours
   - Implementing the backend services, controllers, and gateways.
   - Setting up the job processing logic and integrating with Unsplash API.
   - Implementing file-based storage for job results.

3. **Frontend Development**: 3 hours
   - Implementing the frontend components and pages.
   - Setting up the job creation and display logic.
   - Integrating with the backend API.

4. **WebSocket Integration**: 1 hours
   - Implementing WebSocket communication for real-time job updates.
   - Ensuring the frontend updates job statuses in real-time.

5. **Error Handling and Retry Logic**: 1 hour
   - Implementing error handling and retry logic for unstable internet connections.

6. **Environment Variables and Configuration**: 1 hour
   - Setting up environment variables for sensitive data.
   - Implementing a configuration service for managing environment variables.

7. **Testing**: 2 hours
   - Writing unit and e2e tests for backend services and controllers.
   - Ensuring all test cases are covered.

8. **Documentation and Cleanup**: 1 hour
   - Writing the README file with setup instructions.
   - Cleaning up the code and ensuring proper TypeScript types.

### Total Time Spent: 13 hours