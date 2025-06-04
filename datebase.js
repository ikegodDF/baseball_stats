import express from "express";
import mysql from "mysql2";

const app = express();
app.use(express.json());
app.use(express.static("website"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "ikegodDF",
  password: "tamtam24",
  database: "baseballstats",
});

//データ取得するAPIを試しに作る
