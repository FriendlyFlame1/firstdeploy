const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const xlsx = require('xlsx');

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'excelset',
};
const connectToDatabase = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error;
  }
};
// Configure MySQL connection pool
const pool = mysql.createPool(dbConfig);

app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {

  try {
    const fileBuffer = req.file.buffer;
    const connection = await pool.getConnection();

    // Process the Excel file and save to MySQL here
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    await connection.query('TRUNCATE TABLE users');
    
    for (const row of sheetData) {
      const {id, name, email, address, phoneno } = row;
      await connection.query(
        'INSERT INTO users ( name, email, address, phoneno) VALUES ( ?, ?, ?, ?)',
        [name, email, address, phoneno]
      );
    }

    connection.release();
    res.status(200).json({ message: 'File uploaded and data saved to MySQL.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

