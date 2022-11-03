const { Pool } = require('pg')
const pool = new Pool();

pool.connect()
  .then(() => {console.log('database connected')})
  .catch(err => {console.log(err)})

module.exports = pool;