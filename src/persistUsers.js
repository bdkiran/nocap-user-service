const { Pool } = require('pg')

//Uses environment variables for connection
const pool = new Pool()

//Retrieves a user from the database
const getUserFromDb = async(userID) => {
    const selectSQLStatement = 'SELECT * FROM users where user_id=$1;';
    const values = [userID];
    try {
        const res = await pool.query(selectSQLStatement, values)
        //Is this where this should be, maybe should wait for other transaction to finish...
        //updateUserLastLogin(userID)
        return res.rows[0]
    } catch(err) {
        console.log(err.stack)
        return null
    }
}

const updateUserLastLogin = async(userID) => {
    const updateSQLStatement = 'UPDATE users SET last_logged_in = now() WHERE user_id = $1;'
    const values = [userID];
    try {
        const res = await pool.query(updateSQLStatement, values)
    } catch(err) {
        console.log(err.stack)
    }
}

const createGoogleUser = async(userProfile) => {
    const insertSQLStatement = 'INSERT INTO users(user_id, firstname, lastname, auth_type) VALUES ($1, $2, $3, $4) RETURNING *;'
    const values = [userProfile.id, userProfile.name.givenName, userProfile.name.familyName, 'google'];
    try {
        const res = await pool.query(insertSQLStatement, values);
        return res.rows[0];
    } catch(err) {
        console.log(err.stack);
        return null;
    }
}

module.exports = {
    getUserFromDb, createGoogleUser
}