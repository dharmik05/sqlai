import mysql from 'mysql2/promise';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// 1. DATABASE SETUP (Using your verified config)
const pool = mysql.createPool({
  host: process.env.RDS_HOST ?? "",
  user: process.env.RDS_USER ?? "",
  password: process.env.RDS_PASS ?? "",
  database: process.env.RDS_DB ?? "",
  ssl: { 
    rejectUnauthorized: false // Your verified fix
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 2. SCHEMA DEFINITION (Helping the AI understand Chinook)
const CHINOOK_SCHEMA = `
  Tables:
  - Album (AlbumId, Title, ArtistId)
  - Artist (ArtistId, Name)
  - Track (TrackId, Name, AlbumId, GenreId, Composer, Milliseconds, UnitPrice)
  - Genre (GenreId, Name)
  - Customer (CustomerId, FirstName, LastName, Email, Country)
`;

const NORTHWIND_SCHEMA = `
  Tables:
  - Categories (CategoryID, CategoryName, Description)
  - Customers (CustomerID, CompanyName, ContactName, City, Country)
  - employees (id, company, last_name, first_name, email_address, job_title, business_phone, home_phone, fax_number, address, city, state_province, zip_postal_code)
  - OrderDetails (OrderID, ProductID, UnitPrice, Quantity, Discount)
  - Orders (OrderID, CustomerID, EmployeeID, OrderDate, ShipCity, ShipCountry)
  - Products (ProductID, ProductName, SupplierID, CategoryID, UnitPrice, UnitsInStock)
  - Suppliers (SupplierID, CompanyName, ContactName, City, Country)
`

// 3. CORE FUNCTION
export async function askChinook(question: string) {
  try {
    console.log(`\n❓ Question: ${question}`);

    // Request SQL from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a MySQL expert. Use this schema: ${NORTHWIND_SCHEMA}. 
          Convert the user's question into a valid MySQL query. 
          Return ONLY the raw SQL code. No markdown, no backticks.`
        },
        { role: "user", content: question }
      ],
      temperature: 0,
    });

    const sql = completion.choices[0]?.message?.content?.trim();

    if (!sql) throw new Error("AI failed to generate SQL.");

    console.log(`🤖 Generated SQL: ${sql}`);

    // Execute on RDS
    const [rows] = await pool.query(sql);
    
    console.table(rows); // Prints a nice table in your terminal
    return rows;

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// 4. TEST RUN
const userPrompt = process.argv[2] || "How many employees name starts with letter 'a'?";
askChinook(userPrompt);