import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.URI;
export const Mongoclient = new MongoClient(uri);
