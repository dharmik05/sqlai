# 🤖 AI-Powered Text-to-SQL
A TypeScript-based backend application that translates natural language questions into complex MySQL queries using OpenAI's GPT-4o and executes them on an **AWS RDS** instance.

## 🚀 Overview
This project serves as a bridge between non-technical users and relational databases. By utilizing LLMs, users can "talk" to the **Northwind** database without knowing SQL syntax.

- **Backend:** TypeScript / Node.js
- **AI Engine:** OpenAI GPT-4o
- **Database:** AWS RDS (MySQL)

## 🛠️ Features
- **Schema-Aware Translation:** Uses prompt engineering to feed database schema definitions to the AI for accurate JOINS.
- **Secure Execution:** Implements a `readonly` user profile on MySQL to prevent destructive actions (DROP, DELETE).
- **SSL Integration:** Configured specifically for AWS RDS secure handshake requirements.
- **Type-Safe:** Built with strict TypeScript configurations to ensure robust data handling.

## 📋 Prerequisites

- Node.js (v20+)
- AWS RDS Instance (with Northwind or Chinook DB installed)
- OpenAI API Key

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dharmik05/sqlai.git
   cd sqlai
2. **Add the following in .env file**
    ```markdown
    OPENAI_API_KEY=sk-your-openai-api-key
    RDS_HOST=[Your AWS RDS database endpoint]
    RDS_USER=[Username]
    RDS_PASS=[Password]
    RDS_DB=[DB name]
