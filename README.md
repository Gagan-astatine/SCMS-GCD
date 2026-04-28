# IGNIS - Supply Chain Management System

## Overview
IGNIS is a comprehensive, full-stack Supply Chain Management System designed to streamline logistics operations. The platform provides a centralized hub for managing warehouse inventory, tracking fleets, processing payments, and facilitating communication between business owners, buyers, and drivers. 

## Key Features
- **Role-Based Access Control:** Dedicated, customized dashboards for Owners/Sellers, Buyers, and Drivers.
- **Real-Time Analytics:** Interactive data visualization for warehouse capacity, inbound/outbound volume, and order status tracking.
- **Intelligent Dispatch & Routing:** Fleet status monitoring and map-based tracking for active logistics operations.
- **Secure Payments:** Integrated Razorpay checkout flow for buyers to securely pay for loads.
- **AI-Powered Assistant:** A contextual AI chatbot capable of querying supply chain metrics and providing insights.
- **Regional Localization:** Native integration with Google Translate allowing the entire dashboard to seamlessly translate into English and 10 regional Indian languages.

## Tech Stack

### Frontend
- **Framework:** React.js (Create React App)
- **Routing:** React Router DOM
- **State Management:** Zustand
- **Data Visualization:** Recharts
- **Mapping:** React-Leaflet
- **Styling:** Custom CSS with Responsive Design Principles

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database & Authentication:** Supabase (PostgreSQL)
- **Payment Processing:** Razorpay API
- **AI Integration:** Google Generative AI (Gemini)

## Application Workflow
1. **Authentication:** Users authenticate via Supabase Auth and are automatically routed to their role-specific environment.
2. **Owner/Seller Operations:** Owners manage the master warehouse database, monitor active fleets, view macro-level analytics, and interact with the AI Assistant to make data-driven dispatch decisions.
3. **Buyer Operations:** Buyers access a dedicated portal to view their assigned shipments, monitor delivery statuses on the map, and process outstanding payments securely.
4. **Driver Operations:** Drivers log in to view their active assigned loads, update their transit status, and track their historical earnings.
5. **Cross-Platform Localization:** Any user can instantly translate their dashboard into their preferred regional language using the top-navigation translation widget.

## Prerequisites
To run this application locally, you will need:
- Node.js (v18 or higher recommended)
- A Supabase Project (Database URL, Service Role Key, Anon Key)
- A Razorpay Merchant Account (Key ID and Key Secret)
- A Google Gemini API Key

## Installation & Setup

### 1. Repository Setup
Clone the repository to your local machine:
```bash
git clone https://github.com/Gagan-astatine/SCMS-GCD.git
cd SCMS-GCD
```

### 2. Backend Configuration
Navigate to the backend directory and install the required dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend` directory and populate it with your API credentials:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Configuration
Open a new terminal window, navigate to the frontend directory, and install the required dependencies:
```bash
cd scms
npm install
```

Create a `.env` file in the root of the `scms` directory:
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:5000
```

Start the React development server:
```bash
npm start
```

## Production Deployment
- **Backend:** Configured for deployment on platforms like Render or Heroku. Ensure CORS origins are strictly set to your production frontend URL.
- **Frontend:** Optimized for Vercel. During deployment, ensure the `REACT_APP_API_URL` environment variable is updated to point to the deployed backend URL.

---
*Developed with a focus on ethical data practices, robust security standards, and scalable architecture.*
