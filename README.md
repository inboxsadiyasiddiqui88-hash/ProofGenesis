# ProofGenesis
### An AI-Driven Blockchain Framework for Secure Digital Evidence Preservation and Integrity Verification

## About the Project

ProofGenesis is an AI-driven blockchain framework designed to securely preserve digital evidence and verify its integrity.

The system uses AI-based analysis to assess uploaded digital evidence and blockchain technology to maintain its integrity through cryptographic hash registration.

## Key Features

- **User Authentication:** Secure registration and login using password hashing and JWT authentication.
- **Evidence Upload:** Allows users to upload digital evidence for verification.
- **SHA-256 Hashing:** Generates a unique cryptographic hash for uploaded evidence.
- **AI-Based Analysis:** Analyzes uploaded evidence and generates a risk report with Low, Medium, or High classifications.
- **User Decision:** Allows users to proceed with or cancel blockchain registration.
- **Blockchain Registration:** Records evidence hashes on the blockchain for integrity verification.
- **Evidence Verification:** Verifies evidence integrity by comparing its hash with the registered blockchain hash.
- **Case Management:** Maintains case records and their verification statuses.
- **Role-Based Access:** Provides different access levels for users and investigators/administrators.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Backend | Python, FastAPI |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Password Security | Password Hashing |
| Hashing Algorithm | SHA-256 |
| Blockchain | Smart Contracts |
| AI Analysis | AI-Based Risk Assessment |

## System Workflow

1. User registers and logs into the application.
2. User uploads a digital evidence file.
3. The system generates its SHA-256 hash.
4. AI analyzes the uploaded evidence and generates a risk report.
5. User reviews the report and chooses whether to proceed.
6. If approved, the evidence hash is registered on the blockchain.
7. The system stores the case information and registration status.
8. Evidence can later be verified by comparing its hash with the blockchain record.

## Project Structure

```text
ProofGenesis/
│
├── backend/
│   ├── app/
│   ├── blockchain/
│   ├── evidence_storage/
│   ├── uploads/
│   ├── verification_uploads/
│   ├── requirements.txt
│   └── test_*.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── .gitignore
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ProofGenesis
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables in your local `.env` file.

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend using:

```bash
npm run dev
```

### 4. Database Configuration

Configure your MongoDB Atlas connection using the required environment variables.

### 5. Run the Application

Start the FastAPI backend using its configured application entry point and run the React frontend using the Vite development server.

## Security

- Sensitive credentials and API keys should be stored in environment variables.
- Uploaded evidence files should not be committed to the public source repository.
- SHA-256 hashing is used to verify evidence integrity.
- Access to application features is controlled through authentication and user roles.

## Project Status

Developed as an academic project for secure digital evidence preservation and integrity verification using AI and blockchain technology.