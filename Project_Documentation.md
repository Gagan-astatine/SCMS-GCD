# IGNIS: Comprehensive Technical Project Documentation

## 1. Project Overview
**IGNIS** is an enterprise-grade Supply Chain Management System (SCMS) designed to optimize complex logistics operations. By integrating real-time telemetry, advanced role-based access control (RBAC), and predictive machine learning models, IGNIS establishes a seamless ecosystem for Business Owners, Buyers, and Drivers to interact, transact, and monitor supply chains.

## 2. System Architecture
The application employs a decoupled, highly scalable client-server architecture:
- **Client Tier:** A React.js Single Page Application (SPA) utilizing Zustand for atomic state management and React Router DOM for client-side routing.
- **Application Tier:** A Node.js/Express.js RESTful API service that acts as the orchestration layer for authentication, business logic, payment processing, and ML model inference.
- **Data Tier:** Supabase (PostgreSQL) handles relational data storage, protected by strict Row Level Security (RLS) policies.
- **Machine Learning Tier:** A dedicated Python microservice (`ml-pipeline/`) housing the Random Forest and LSTM predictive models.

## 3. Machine Learning Integration (Overflow Prediction)
A core innovation of IGNIS is its proactive **Machine Learning Pipeline**, which predicts warehouse capacity constraints before they disrupt operations.

### 3.1 Model Ensemble Topology
The system utilizes a hybrid ensemble approach:
- **Random Forest Regressor:** Processes high-dimensional scalar features (current inventory, load velocity, baseline capacity) to output an immediate risk probability coefficient.
- **Long Short-Term Memory (LSTM) Network:** Ingests the previous 24 hours of sequential operational telemetry to identify time-series dependencies and load accumulation trends.

### 3.2 Feature Engineering Pipeline
The models evaluate multiple real-time heuristics:
- `current_inventory_load`: Absolute mass/volume currently housed.
- `inbound_shipment_velocity`: Rate of inventory accumulation (ΔInventory/ΔTime).
- `rolling_capacity_average`: Historical mean capacity utilization over a sliding window.

### 3.3 Environmental Disruption Factor
The prediction engine dynamically queries the **Google Weather API**. If severe localized weather anomalies (e.g., cyclones, severe flooding) are detected within a 50km radius of the warehouse, the base risk probability is augmented by a multiplier (scaling up to 1.35x) to account for transit delays and bottlenecking.

### 3.4 Predictive Telemetry Outputs
The ML pipeline continuously streams actionable intelligence back to the Owner dashboard:
- **Overflow Risk Probability Percentage**
- **Estimated Time to Critical Overflow (ETCO)**
- **Algorithmic Rerouting & Mitigation Recommendations**

## 4. Core Feature Set
- **Granular Access Control:** Cryptographically secure JWT sessions managed via Supabase Auth, routing users to distinct dashboards (Owner, Buyer, Driver).
- **Intelligent Dispatch & Spatial Routing:** Live map-based geospatial tracking of active fleets using custom React-Leaflet layers.
- **Secure Financial Settlement:** Integrated Razorpay checkout flow with webhook synchronization for auditable transactions.
- **Generative AI Assistant:** A Gemini-powered heuristic bot that processes natural language queries regarding supply chain metrics and generates operational reports.
- **Dynamic Localization Engine:** Sub-second, zero-refresh dashboard translation into English and 10 regional Indian languages via Google Cloud Translation API.

## 5. Database Design & Security
- **Relational Integrity:** PostgreSQL handles complex joins between `users`, `warehouses`, `shipments`, and `transactions`.
- **Row Level Security (RLS):** Database queries are strictly scoped to the authenticated user's ID, preventing unauthorized horizontal data traversal.
- **Environment Isolation:** Secrets (API Keys, Service Roles) are decoupled from the codebase and injected at runtime via environment variables.

## 6. API Integrations & Cloud Services

### Google Cloud Platform (GCP) Services
IGNIS is deeply integrated with the Google Cloud ecosystem, leveraging 8 primary services:
1. **Google Gemini API:** Powers the contextual AI Assistant for natural language supply chain querying.
2. **Google Cloud Translate:** Drives the sub-second dashboard localization across 10 Indian regional languages.
3. **Google Cloud Speech-to-Text:** Enables voice commands for drivers logging their transit statuses hands-free.
4. **Google Cloud Vision (OCR):** Scans and extracts text from uploaded invoices, waybills, and driver licenses.
5. **Google Cloud AI Platform:** Hosts the production Machine Learning pipeline for overflow prediction.
6. **Google Cloud Storage:** Provides scalable blob storage for retaining invoice PDFs and file artifacts.
7. **Google Cloud Run:** Facilitates the serverless, containerized deployment of the Node.js backend.
8. **Firebase Hosting:** Provides edge-optimized, global content delivery for the React.js frontend.

### Third-Party APIs
- **Google Weather API:** Augments the Machine Learning risk predictions with severe weather disruption heuristics.
- **Razorpay API:** Manages the secure payment gateway and transaction lifecycle.
- **Supabase API:** Handles authentication, Row Level Security (RLS), and database queries.

## 7. Deployment Strategy
- **Frontend (Edge):** Optimized for high-availability edge networks (e.g., Vercel), with static assets cached globally via CDN.
- **Backend & ML Services:** Containerized or hosted on PaaS providers (e.g., Render, AWS Elastic Beanstalk) to ensure horizontal scalability during peak traffic loads.
