import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function verifyDB() {
  console.log("🚀 Testing RDS Connection...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASS,
      database: process.env.RDS_DB,
      ssl: { rejectUnauthorized: false }
    });

    const [rows] = await connection.query('SELECT "Connection Successful!" as status');
    console.log("✅ Success:", rows);
    await connection.end();
  } catch (error: any) {
    console.error("❌ Connection Failed!");
    console.error("Error Code:", error.code);
    console.error("Message:", error.message);
    console.log("\n💡 Check: Is your IP whitelisted in the AWS RDS Security Group?");
  }
}
verifyDB();