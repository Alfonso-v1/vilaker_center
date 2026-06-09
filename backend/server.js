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
        const query1 = `SELECT 
            Members.member_id AS 'Member ID',
            Members.first_name AS 'First Name',
            Members.last_name AS 'Last Name',
            Members.email AS 'Email',
            Members.membership_tier AS 'Membership Tier ID',
            MemberTiers.tier_name AS 'Membership Tier'
            FROM Members
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
        const query1 = `SELECT 
            membership_tier as 'Membership Tier ID',
            tier_name as Tier,
            price as 'Annual Fee',
            CONCAT(FORMAT(rental_discount * 100, 0), '%') as 'Rental Discount',
            rental_period as 'Tool Rental Period (Days)'
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
        const query1 = `SELECT 
            Tools.tool_id,
            Tools.name as 'Tool',
            Tools.condition as 'Condition',
            Tools.membership_tier as 'Minimum Required Tier ID',
            MemberTiers.tier_name as 'Minimum Required Tier',
            Tools.rental_fee as 'Rental Fee'
            FROM Tools
            LEFT JOIN MemberTiers ON Tools.membership_tier = MemberTiers.membership_tier;`;
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
        const query1 = `SELECT 
            Rentals.rental_id AS 'Rental ID',
            CONCAT(Members.first_name, ' ', Members.last_name) AS 'Member Name',
            Tools.name AS 'Tool Rented', DATE_FORMAT(Rentals.rent_date, '%M %d, %Y') AS 'Rent Date',
            DATE_FORMAT(Rentals.due_date, '%M %d, %Y') as 'Due Date',
            DATE_FORMAT(Rentals.returned_date, '%M %d, %Y') as 'Date Returned', Rentals.fee
            FROM Rentals
            INNER JOIN Members ON Members.member_id = Rentals.member_id
            INNER JOIN Tools ON Tools.tool_id = Rentals.tool_id;`;
        const query2 = `SELECT * FROM Tools;`;
        const query3 = `SELECT
            Members.member_id,
            Members.first_name,
            Members.last_name,
            Members.membership_tier,
            MemberTiers.tier_name,
            MemberTiers.rental_period,
            MemberTiers.rental_discount
            FROM Members
            INNER JOIN MemberTiers ON Members.membership_tier = MemberTiers.membership_tier;`;
        const [rentals] = await db.query(query1);
        const [tools] = await db.query(query2);
        const [members] = await db.query(query3)
    
        res.status(200).json({ rentals, tools, members });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/classRegistrations', async (req, res) => {
    try {
        const query1 = `SELECT 
            class_name as 'Classes',
            COUNT(ClassRegistrations.class_registration_id) as 'Total Class Registrations',
            Classes.capacity - COUNT(ClassRegistrations.class_registration_id) AS 'Remaining Spots',
            Classes.capacity as 'Total Class Capacity'
            FROM Classes
            LEFT JOIN ClassRegistrations ON Classes.class_id = ClassRegistrations.class_id
            GROUP BY Classes.class_id, Classes.capacity, Classes.class_name;`;
        const query2 = `SELECT 
            class_id,
            class_name,
            DATE_FORMAT(start_date, '%M %d, %Y') AS 'Begins On',
            DATE_FORMAT(end_date, '%M %d, %Y') AS 'Ends On'
            FROM Classes;`;
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
        const query1 = `SELECT 
            class_id as 'Class ID', instructor_name as Instructor,
            class_name as Course, description as 'Course Description',
            capacity as Capacity,
            DATE_FORMAT(start_date, '%M %d, %Y') AS 'Begins On',
            DATE_FORMAT(end_date, '%M %d, %Y') AS 'Ends On',
            DATE_FORMAT(start_date, '%Y-%m-%d') AS 'Start Date Value',
            DATE_FORMAT(end_date, '%Y-%m-%d') AS 'End Date Value'
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
        const query1 = `SELECT 
            ClassRegistrations.class_registration_id AS 'Registration ID',
            ClassRegistrations.class_id AS 'Class ID',
            CONCAT(Members.first_name, ' ', Members.last_name) AS 'Member Name',
            Classes.class_name as 'Class', DATE_FORMAT(start_date, '%M %d, %Y') as 'Begins On',
            DATE_FORMAT(end_date, '%M %d, %Y') as 'Ends On'
            FROM ClassRegistrations
            INNER JOIN Classes ON ClassRegistrations.class_id = Classes.class_id
            INNER JOIN Members ON ClassRegistrations.member_id = Members.member_id
            WHERE ClassRegistrations.member_id = ?`
        const [registrations] = await db.query(query1, [member_id]);
        res.status(200).json({ registrations });
    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.post('/reset', async (req, res) => {
    try {
        await db.query('CALL sp_reset_db()');
        res.status(200).json({ message: 'Database Reset' });
    } catch (error) {
        console.error('Reset Failed:', error);
        res.status(500).json({ error: 'Database reset failed.' });
    }
});

app.post('/members/delete', async (req, res) => {
    try {
        let data = req.body;

        const query1 = `CALL sp_delete_member(?);`;
        await db.query(query1, [data.delete_member_id]);

        console.log(`DELETE Members. ID: ${data.delete_member_id}`);

        res.status(200).json({ message: 'Member deleted.' });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occured while executing the database queries. Please retry.');
    };
})

app.post('/rentals/create', async (req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_create_rental(?, ?, ?, ?, ?, ?);`;

        const result = await db.query(query1, [
            data.member_id,
            data.tool_id, 
            data.rent_date,
            data.due_date,
            data.returned_date,
            data.fee
        ])

        const createdRentalID = result[0][0][0].rental_id;
        const procedureMessage = result[0][0][0].RESULT;

        console.log(
            `CREATE Rental. ID: ${createdRentalID}, ` +
            `RESULT: ${procedureMessage}`
        );

        res.status(200).json({message: procedureMessage})
    } catch (error) {
        console.error('Error creating rental:', error);
        res.status(500).send('An error occurred while creating the rental.');
    }
})

app.post('/rentals/update', async (req, res) => {
    try {
        const data = req.body;

        if (isNaN(parseInt(data.update_rental_id))) {
            data.update_rental_id = null;
        }

        if (!data.update_return_date) {
            data.update_return_date = null;
        }

        const query1 = `CALL sp_update_rental(?, ?)`

        const [result] = await db.query(query1, [
            data.update_rental_id,
            data.update_return_date
        ]);

        const procedureMessage = result[0][0].RESULT;

        console.log(
            `UPDATE rental. ID: ${data.update_rental_id}, ` +
            `Returned Date: ${data.update_return_date}, ` +
            `Result: ${procedureMessage}`
        );

        res.status(200).json({ message: procedureMessage });
    } catch (error) {
        console.error('Error updating rental:', error);
        res.status(500).send('An error occurred while updating the rental.');
    }
})

app.post('/members/create', async (req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_create_member(?, ?, ?, ?)`;

        const [result] = await db.query(query1, [
            data.first_name,
            data.last_name,
            data.email,
            data.membership_tier
        ]);
        
        const createdMemberId = result[0][0].member_id;
        const procedureMessage = result[0][0].RESULT;

        console.log(
            `CREATE member. ID: ${createdMemberId}, ` +
            `Result: ${procedureMessage}`
        );

        res.status(200).json({ message: procedureMessage });
    } catch (error) {
        console.error( 'Error creating member', error );
        res.status(500).send('An error occured while creating the member.');
    }
})

app.post('/members/update', async (req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_update_member(?, ?, ?, ?, ?);`;

        const [result] = await db.query(query1, [
            data.update_member_id,
            data.update_member_first_name,
            data.update_member_last_name,
            data.update_member_email,
            data.update_member_tier
        ]);


        const procedureMessage = result[0][0].RESULT;

        console.log(
            `UPDATE member. ID: ${data.update_member_id}, ` +
            `Result: ${procedureMessage}`
        );

        res.status(200).json({ message: procedureMessage });
    } catch (error) {
        console.error('Error updating member', error); 
        res.status(500).json({message: 'Error: member not updated.'});
    }
})

app.post('/memberTiers/update', async(req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_update_membertiers(?, ?, ?, ?);`;

        const [result] = await db.query(query1, [
            data.update_tier_id,
            data.update_fee, 
            data.update_discount,
            data.update_rental_period
        ]);

        const procedureMessage = result[0][0].RESULT;

        console.log(
            `UPDATE Membership Tier. ID: ${data.update_tier_id}, ` +
            `Result: ${procedureMessage}`
        );

        res.status(200).json({message: procedureMessage});
    } catch (error) {
        console.error('Error updating tier', error);
        res.status(500).send('An error occured while updating tier.');
    }
})

app.post('/tools/create', async (req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_create_tool(?, ?, ?, ?);`;

        const [result] = await db.query(query1, [
            data.name,
            data.condition,
            data.membership_tier,
            data.rental_fee
        ]);

        const createdToolID = result[0][0].tool_id;
        const procedureMessage = result[0][0].RESULT;

        console.log(
            `CREATE Tool. ID: ${createdToolID},` +
            `RESULT: ${procedureMessage}`
        );

        res.status(200).json({message: procedureMessage})
    } catch (error) {
        console.error('Error creating tool', error);
        res.status(500).send('An error occurred while creating tool.');
    }
})


app.post('/tools/update', async(req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_update_tool(?, ?, ?, ?, ?);`;

        const [result] = await db.query(query1, [
            data.update_tool_id, 
            data.update_tool_name, 
            data.update_tool_condition,
            data.update_tool_tier,
            data.update_rental_fee
        ]);

        const procedureMessage = result[0][0].RESULT;

        console.log(
            `UPDATE Tool. ID: ${data.update_tool_id}, ` +
            `RESULT: ${procedureMessage}`
        );

        res.status(200).json({message: procedureMessage});
    } catch (error) {
        console.error('Error updating tier', error);
        res.status(500).send('An error occured while updating tool.');
    }
})

app.post('/tools/delete', async (req, res) => {
    try { 
        const data = req.body;

        const query1 = `CALL sp_delete_tool(?);`;

        const result = await db.query(query1, [data.delete_tool_id]);

        const procedureMessage = result[0][0][0].RESULT;

        console.log(
            `DELETE Tool. RESULT: ${procedureMessage}`
        );
        res.status(200).json({message: procedureMessage})
    } catch (error) {
        console.error('Error deleting tool', error);
        res.status(500).send('An error occured while deleting tool.');
    }
})

app.post('/classes/create', async (req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_create_class(?, ?, ?, ?, ?, ?);`;

        const result = await db.query(query1, [
            data.instructor_name,
            data.class_name,
            data.description,
            data.capacity,
            data.start_date,
            data.end_date
        ]);

        const createdClassID = result[0][0][0].class_id;
        const procedureMessage = result[0][0][0].RESULT;

        console.log(
            `CREATE Class. ID: ${createdClassID}, ` +
            `RESULT: ${procedureMessage}`
        )
        res.status(200).json({message: procedureMessage})
    } catch (error) {
        console.error('Error creating class', error);
        res.status(500).send('An error occured while creating class.');
    }
})

app.post('/classes/update', async (req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_update_class(?, ?, ?, ?, ?, ?, ?);`;

        const result = await db.query(query1, [
            data.update_class_id,
            data.update_instructor_name,
            data.update_course_name,
            data.update_course_description,
            data.update_capacity,
            data.update_start_date,
            data.update_end_date
        ]);

        const procedureMessage = result[0][0][0].RESULT;

        console.log(
            `UPDATE Class. ID: ${data.update_class_id}, ` +
            `RESULT: ${procedureMessage}`
        )
        res.status(200).json({message: procedureMessage})
    } catch (error) {
        console.error('Error updating class', error);
        res.status(500).send('An error occured while updating class.');
    }
})

app.post('/classes/delete', async (req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_delete_class(?);`;

        const result = await db.query(query1, [data.delete_class_id]);

        const procedureMessage = result[0][0][0].RESULT;

        console.log(
            `DELETE Class. RESULT: ${procedureMessage}`
        )

        res.status(200).json({message: procedureMessage})
    } catch (error) {
        console.error('Error deleting class', error);
        res.status(500).send('An error occurred while deleting the class.');
    }
})

app.post('/class-registrations/create', async (req, res) => {
    try {
        const data = req.body;
        
        const query1 = `CALL sp_create_registration(?, ?);`;

        const result = await db.query(query1, [
            data.member_id,
            data.class_id
        ])

        const createdRegistrationID = result[0][0][0].class_registration_id;
        const procedureMessage = result[0][0][0].RESULT;

        console.log(
            `CREATE Registration. ID: ${createdRegistrationID}, ` +
            `RESULT: ${procedureMessage}`
        )

        res.status(200).json({message: procedureMessage})
    } catch (error) {
        console.error('Error creating registration', error);
        res.status(500).send('An error occured while registering.');
    }
})

app.post('/class-registrations/update', async (req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_update_registration(?, ?);`;

        const result = await db.query(query1, [
            data.update_registration_id,
            data.update_class_id
        ])

        const procedureMessage = result[0][0][0].RESULT;

        console.log(
            `UPDATE Registration. ID: ${data.update_registration_id}. ` +
            `RESULT: ${procedureMessage}`
        )

        res.status(200).json({message: procedureMessage})
    } catch (error) {
        console.error('Error updating registration', error);
        res.status(500).send('An error occured while updating registration.');
    }
})

app.post('/class-registrations/delete', async (req, res) => {
    try {
        const data = req.body;

        const query1 = `CALL sp_delete_registration(?);`;

        const result = await db.query(query1, [data.delete_registration_id])

        const procedureMessage = result[0][0][0].RESULT;

        console.log(
            `DELETE Registration. RESULT: ${procedureMessage}`
        )

        res.status(200).json({message: procedureMessage})
    } catch (error) {
        console.error('Error deleting registration', error);
        res.status(500).send('An error occured while deleting registration.');
    }
})

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});
