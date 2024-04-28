import { copyFileSync } from "fs";
import { Client } from "pg";
import { number } from "zod";
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  // host:"ep-bold-bush-a55qdzwj.us-east-2.aws.neon.tech",
  // port:5432,
  // database:"test",
  // user:"test_owner",
  // password: "VfZz2YDh9RMg"
  connectionString: process.env.URL_PATH
});



async function createTable() { 
    await client.connect();
    const result = await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR (255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    
    `);
  console.log(result);
}

async function addData(username: string,email: string,password: string){
    try{
        await client.connect();

        const query = "INSERT INTO users (username,email,password) VALUES ($1, $2, $3)";
        const values = [username,email,password];

        const result = await client.query(query, values);

        console.log("Data entered successfully...");

    }
    catch(error){
        console.log("---Error in insertion: " + error);
    }
    finally{
        try {
            await client.end();
            console.log("Connection closed successfully.");
        } catch (error) {
            console.error("Error closing connection:", error);
        }
    }
}

async function findData(email:string){
    try{
        await client.connect();
        const querr = "SELECT * FROM users WHERE email = $1";
        const value = [email];
        const result = await client.query(querr, value);
        if(result.rows.length > 0){
            console.log(result.rows[0]);
        }
        else{
            console.log("User Not found");
        }

    }
    catch (error){
        console.log(error);

    }
    finally{
        await client.end();
        console.log("Connection closed");
    }
}

findData("sarpalkunal@gmail.com").catch(console.error);
