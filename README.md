# Disha for India

Disha for India is India's volunteer impact platform where volunteers contribute to society while building verified experience, leadership, recognition, and career opportunities.

## Repository Structure

```text
DISHA-FOR-INDIA/
├── docs/               # Documentation
├── server/             # Backend Application (Node.js/Express)
│   ├── src/            # Source code
│   ├── .env.example    # Environment variables example
│   ├── .eslintrc.json  # ESLint configuration
│   ├── .gitignore      # Server-specific gitignore
│   ├── .prettierrc     # Prettier configuration
│   └── package.json    # Dependencies and scripts
├── .gitignore          # Root gitignore
└── README.md           # Project readme
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB

### Installation & Run

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables.

4. Start the development server:
   ```bash
   npm run dev
   ```
