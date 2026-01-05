# DesignHire - Job Board Platform

A full-stack MERN job board application connecting designers with recruiters.

## Tech Stack

**Frontend:**
- React 19 with Vite
- Redux Toolkit for state management
- TailwindCSS for styling
- React Router for navigation

**Backend:**
- Node.js with Express 5
- MongoDB with Mongoose
- JWT authentication
- Cloudinary for file uploads

## Features

### For Applicants
- Browse and search jobs with filters
- Apply to jobs with resume upload
- Save jobs for later
- Track application status
- Profile management with skills and bio

### For Recruiters
- Post and manage job listings
- View and filter applicants
- Update application statuses (pending/accepted/rejected)
- Dashboard with analytics (views, clicks, applicants)
- Company profile management

### General
- Dual-role authentication (Applicant/Recruiter)
- Dark mode support
- Responsive design
- Real-time form validation

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for file uploads)

### Environment Variables

Create a `.env` file in the `server` folder:

```
PORT=8001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/khushi512/MERN_PROJECT.git
cd MERN_PROJECT/app
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client/my-app
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend (new terminal):
```bash
cd client/my-app
npm run dev
```

3. Open http://localhost:5173 in your browser

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset

### User
- `GET /api/user/profile` - Get current user profile
- `PATCH /api/user/profile` - Update user profile
- `GET /api/user/applied` - Get applied jobs (applicant)
- `GET /api/user/saved` - Get saved jobs (applicant)
- `POST /api/user/save/:jobId` - Save a job
- `DELETE /api/user/save/:jobId` - Remove saved job

### Jobs
- `GET /api/job` - Get all jobs with filters
- `GET /api/job/:id` - Get job details
- `POST /api/job` - Create new job (recruiter)
- `PUT /api/job/:id` - Update job (recruiter)
- `DELETE /api/job/:id` - Delete job (recruiter)
- `POST /api/job/:id/apply` - Apply to job (applicant)
- `DELETE /api/job/:id/withdraw` - Withdraw application
- `GET /api/job/posted` - Get recruiter's posted jobs
- `GET /api/job/all-applicants` - Get all applicants (recruiter)
- `PATCH /api/job/:jobId/applicant/:userId/status` - Update applicant status

## Project Structure

```
app/
├── client/
│   └── my-app/
│       └── src/
│           ├── apiCalls/      # API service functions
│           ├── components/    # Reusable components
│           ├── contexts/      # React contexts (Theme)
│           ├── pages/         # Page components
│           ├── redux/         # Redux store and slices
│           └── utils/         # Utility functions
└── server/
    ├── config/         # Database and token config
    ├── controllers/    # Route controllers
    ├── middlewares/    # Auth and upload middleware
    ├── models/         # Mongoose schemas
    ├── routes/         # API routes
    └── uploads/        # Uploaded files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
