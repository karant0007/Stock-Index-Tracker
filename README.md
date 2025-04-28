# Stock Index Tracker

A web application for tracking stock index values with real-time data visualization and price alerts.

## Features

- User authentication and authorization with Firebase
- Overview of available stock indices
- Real-time graphical representation of index values
- Price alert system with email notifications
- API usage statistics

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Recharts
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **API**: Finnhub Stock API

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account
- Finnhub API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/stock-index-tracker.git
   cd stock-index-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Firebase and Finnhub API credentials:

   ```
   # Firebase Client Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   # Finnhub API Key
   NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key

   # Firebase Admin SDK (for Server-Side)
   FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_private_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password method)
3. Create a Firestore database
4. Add Firebase to your web app to get your credentials
5. Set up Firebase Admin SDK for server-side functionality

### Deployment

To deploy to Firebase Hosting:

1. Install the Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:

   ```bash
   firebase login
   ```

3. Initialize your project:

   ```bash
   firebase init
   ```

4. Build your Next.js application:

   ```bash
   npm run build
   # or
   yarn build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Project Structure

```
stock-index-tracker/
├── public/              # Static files
├── src/
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   ├── context/         # React contexts (Auth)
│   ├── lib/             # Utility functions and API clients
│   └── utils/           # Helper functions
├── .env.local           # Environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
└── tailwind.config.js   # Tailwind CSS configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
