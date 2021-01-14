const { Pool } = require('pg')

//Uses environment variables for connection
const pool = new Pool()

const getUserFromDb = async(userID) => {
    const selectSQLStatement = 'SELECT user_id, firstname, lastname, email FROM users WHERE user_id=$1';
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

//Retrieves a user from the database
const getSocialUserFromDb = async(socialID, authType) => {
    const selectSQLStatement = 'SELECT user_id, firstname, lastname, email FROM users WHERE social_id=$1 AND auth_type=$2;';
    const values = [socialID, authType];
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
    const insertSQLStatement = 'INSERT INTO users(firstname, lastname, email, auth_type, social_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;'
    const values = [userProfile._json.given_name, userProfile._json.family_name, userProfile._json.email, 'google', userProfile.id];
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
    const values = [userID];
    try {
        const res = await pool.query(deleteSQLStatement, values);
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
    getUserFromDb, getSocialUserFromDb, createGoogleUser, deleteUserFromDB
}