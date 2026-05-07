// ########################################
// ########## SETUP

require("dotenv").config();

// Database
const db = require('./database/db-connector');

// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests


const PORT = process.env.BACKEND_PORT;

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/members', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT Members.member_id AS 'Member ID', Members.first_name AS 'First Name', \
            Members.last_name AS 'Last Name', Members.email AS 'Email', MemberTiers.tier_name AS 'Member Tier' \
            FROM Members \
            LEFT JOIN MemberTiers ON Members.membership_tier = MemberTiers.membership_tier;`;
        const query2 = 'SELECT * FROM MemberTiers;';
        const [members] = await db.query(query1);
        const [memberTiers] = await db.query(query2);
    
        res.status(200).json({ members, memberTiers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});
