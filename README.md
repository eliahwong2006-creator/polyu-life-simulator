# PolyU Life Simulator

A real-life university life simulation game for The Hong Kong Polytechnic University.

## Game Overview

Players engage in real-life activities and challenges while the website tracks their "life stats" (attributes & money). An admin (Game Master) updates stats based on real-world performance.

## Attributes

- **Wisdom**: Academic performance
- **Strength**: Physical capability
- **Social**: Networking ability
- **Sanity**: Mental health
- **Energy**: Stamina/Time
- **Money**: Financial status

## Technology Stack

- **Frontend**: React.js (deployed on GitHub Pages)
- **Backend**: Firebase (Firestore, Authentication)
- **Charts**: Recharts
- **Notifications**: React-Toastify

## Setup Instructions

### Prerequisites

1. Node.js (v14 or higher)
2. Firebase account
3. GitHub account

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/polyu-life-simulator.git

# Navigate to project
cd polyu-life-simulator

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your Firebase credentials

# Start development server
npm start
