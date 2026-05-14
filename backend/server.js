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

app.get('/memberTiers', async (req, res) => {
    try {
        const query1 = `SELECT tier_name as Tier, price as 'Annual Fee', \
            CONCAT(FORMAT(rental_discount * 100, 0), '%') as 'Rental Discount', \
            rental_period as 'Tool Rental Period (Days)' \
            FROM MemberTiers;`;
        const [memberTiers] = await db.query(query1);
    
        res.status(200).json({ memberTiers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/tools', async (req, res) => {
    try {
        const query1 = `SELECT Tools.name as 'Tool', Tools.condition as 'Condition', \
            Tools.membership_tier as 'Minimum Required Tier', Tools.rental_fee as 'Rental Fee' \
            FROM Tools;`;
        const query2 = 'SELECT * FROM MemberTiers;';
        const [tools] = await db.query(query1);
        const [memberTiers] = await db.query(query2);
    
        res.status(200).json({ tools, memberTiers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/rentals', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT Rentals.rental_id AS 'Rental ID', CONCAT(Members.first_name, ' ', Members.last_name) AS 'Member Name', \
        Tools.name AS 'Tool Rented', DATE_FORMAT(Rentals.rent_date, '%M %d, %Y') AS 'Rent Date', DATE_FORMAT(Rentals.due_date, '%M %d, %Y') as 'Due Date', \
        DATE_FORMAT(Rentals.returned_date, '%M %d, %Y') as 'Date Returned', Rentals.fee
        FROM Rentals
        INNER JOIN Members ON Members.member_id = Rentals.member_id
        INNER JOIN Tools ON Tools.tool_id = Rentals.tool_id;`;
        const query2 = `SELECT * FROM Tools;`;
        const [rentals] = await db.query(query1);
        const [tools] = await db.query(query2);
    
        res.status(200).json({ rentals, tools });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/classRegistrations', async (req, res) => {
    try {
        const query1 = `SELECT class_name as 'Classes', \
            COUNT(ClassRegistrations.class_registration_id) as 'Total Class Registrations', \
            Classes.capacity - COUNT(ClassRegistrations.class_registration_id) AS 'Remaining Spots', \
            Classes.capacity as 'Total Class Capacity' \
            FROM Classes \
            LEFT JOIN ClassRegistrations ON Classes.class_id = ClassRegistrations.class_id \
            GROUP BY Classes.class_id, Classes.capacity, Classes.class_name;`;
        const query2 = `SELECT * FROM Classes;`;
        const query3 = `SELECT * FROM Members`;
        const [classRegistrations] = await db.query(query1);
        const [classes] = await db.query(query2);
        const [members] = await db.query(query3);
        res.status(200).json({ classRegistrations, classes, members });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/classes', async (req, res) => {
    try {
        const query1 = `SELECT class_id as 'Class ID', instructor_name as Instructor, \
            class_name as Course, description as 'Course Description', \
            capacity as Capacity, \
            DATE_FORMAT(start_date, '%M %d, %Y') as 'Begins On', \
            DATE_FORMAT(end_date, '%M %d, %Y') as 'Ends On' \
            FROM Classes;`;
        const [classes] = await db.query(query1);
    
        res.status(200).json({ classes });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/memberRegistrations/:member_id', async (req, res) => {
    try {
        const { member_id } = req.params;
        const query1 = `SELECT CONCAT(Members.first_name, ' ', Members.last_name) AS 'Member Name', \
            Classes.class_name as 'Class', DATE_FORMAT(start_date, '%M %d, %Y') as 'Begins On', \
            DATE_FORMAT(end_date, '%M %d, %Y') as 'Ends On' \
            FROM ClassRegistrations \
            INNER JOIN Classes ON ClassRegistrations.class_id = Classes.class_id \
            INNER JOIN Members ON ClassRegistrations.member_id = Members.member_id \
            WHERE ClassRegistrations.member_id = ?`
        const [registrations] = await db.query(query1, [member_id]);
        res.status(200).json({ registrations });
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
