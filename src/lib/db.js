import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres:P@ssw0rd@127.0.0.1:5432/pharmacy'
});

export default pool;
