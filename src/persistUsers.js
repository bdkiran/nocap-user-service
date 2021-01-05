const { Pool } = require('pg')

//Uses environment variables for connection
const pool = new Pool()

//Retrieves a user from the database
const getUserFromDb = async(userID) => {
    const selectSQLStatement = 'SELECT user_id, firstname, lastname, email FROM users where user_id=$1;';
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
    const insertSQLStatement = 'INSERT INTO users(user_id, firstname, lastname, email, auth_type) VALUES ($1, $2, $3, $4, $5) RETURNING *;'
    const values = [userProfile.id, userProfile._json.given_name, userProfile._json.family_name, userProfile._json.email, 'google'];
    try {
        const res = await pool.query(insertSQLStatement, values);
        return res.rows[0];
    } catch(err) {
        console.log(err.stack);
        return null;
    }
}

const deleteUserFromDB = async(userID) => {
    const deleteSQLStatement = `DELETE FROM users where user_id=$1;`;
    const values = [BigInt(userID)];
    try {
        const res = await pool.query(deleteSQLStatement, values);
        console.log(res)
        //If id doesn't exist, will return true.
        //Not sure if this is intended api useage.
        if (res.rowCount === 0) {
            return false;
        }
        return true;
    } catch(err) {
        console.log(err.stack)
        return false;
    }
}

module.exports = {
    getUserFromDb, createGoogleUser, deleteUserFromDB
}