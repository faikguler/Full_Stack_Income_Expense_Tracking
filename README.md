# Full Stack Income and Expense Tracking

A full-stack web application for tracking personal income and expenses. The project provides a clean dashboard where users can register, login, manage financial transactions, filter them by category or type, and view income/expense summaries.

The application is built using **Node.js, Express, Sequelize, Vanilla JavaScript, HTML5, and CSS3**.

---
## Live Demo

🌐 [View Live Demo](https://full-stack-income-expense-tracking.onrender.com/)

Test Account

Email: test@test.com  
Password: 123456


# Features

- 🔐 **User Authentication** – Register and login using JWT tokens stored in `localStorage`.
- 📊 **Dashboard Overview** – See total income, total expenses, and your current balance.
- ➕ **Add Transactions** – Add new income or expense entries with date, category, description, and amount.
- ✏️ **Edit & Delete Transactions** – Modify or remove transactions anytime.
- 🎯 **Filtering System** – Filter transactions by type (income / expense) and category.
- 📱 **Responsive Design** – Works smoothly on desktop, tablet, and mobile devices.
- 🎨 **Modern UI** – Clean layout with card design, hover effects, and sticky navigation.

---

# Technologies Used

**Frontend**
- HTML5
- CSS3 (Flexbox + Custom Properties)
- JavaScript (ES6+)
- Fetch API

## Backend
- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication
- REST API

## Database
- SQL database (via Sequelize)

---

# Getting Started

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/faikguler/Full_Stack_Income_Expense_Tracking.git
cd Full_Stack_Income_Expense_Tracking
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```
PORT=3001

DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_HOST=your_host
DB_PORT=your_port
DB_DIALECT=mysql

SESSION_SECRET=your_secret_key

```

---

### 4. Create the database

```sql
CREATE DATABASE your_database_name;
```



### 5. Run database seed (optional)

```
npm run seed

```

This will create:

- Example user
- Example categories
- Example transactions

---

### 6. Start the server

```
npm start
```

### 7. Open the application

Open:

```
http://localhost:3001
```

# Example Test Account

```
Email: test@test.com
Password: 123456
```



# Usage

1. Register a new account.
2. Login using your credentials.
3. Access the **Dashboard**.
4. Add income or expense transactions.
5. Filter transactions by type or category.
6. Edit or delete transactions when needed.
7. Logout from the navigation menu.

---

# API Endpoints

## User Routes

| Method | Endpoint | Description |
|------|------|------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/me` | Get current user |
| POST | `/api/users/logout` | Logout user |

---

## Transaction Routes

| Method | Endpoint | Description |
|------|------|------|
| GET | `/api/transactions` | Get user transactions |
| GET | `/api/transactions/:id` | Get single transaction |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

---

## Reports

| Method | Endpoint | Description |
|------|------|------|
| GET | `/api/transactions/report/range` | Get report between dates |

Example:

```
/api/transactions/report/range?startDate=2026-01-01&endDate=2026-02-01
```
Response:

```
{
  transactions: [],
  summary: {
    totalIncome: 10000,
    totalExpense: 3500,
    netBalance: 6500
  }
}
```


# Author

**Faik Ramadan**

🌐 https://faikguler.com