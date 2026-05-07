/* 
    Data Manipulation Queries for Project Group 21: Vilaker Community Center.
    Authored by Kylee Longaker
    Edited and Approved by Alfonso Vilchez
    Last Edited: 5/6/2026 21:17 
*/

-- User Interaction Denoted by & --


--MemberTiers Page --

/* SELECT (Display) MemberTiers Options */
SELECT tier_name as Tier, price as 'Monthly Fee', rental_discount * 100 as 'Rental Discount', 
rental_period as 'Tool Rental Period (Days)'
FROM MemberTiers;

/* Create an UPDATE option to adjust a current member's Member Tier.
        User must enter first name, last name, and ID number. */
UPDATE Members SET membership_tier = &membership_tier_from_dropdown 
WHERE first_name = &first_name AND last_name = &last_name AND member_id = &member_id;


--Members Page--

/* Display current # of members */
SELECT COUNT(member_id) as 'Number of Members' FROM Members;

/* CREATE a new member */
INSERT INTO Members (first_name, last_name, email, membership_tier)
VALUES (&first_name, &last_name, &email, &membership_tier_from_dropdown);

/* DELETE a member */
DELETE FROM Members WHERE member_id = &member_id;
DELETE FROM ClassRegistrations WHERE member_id = &member_id

--Classes Page--

SELECT Classes.class_id as 'Registration ID', Classes.instructor_name as Instructor, 
Classes.class_name as Course, Classes.description as 'Course Description', 
capacity as Capacity, start_date as 'Begins On', end_date as 'Ends On'
FROM Classes;

--Tools Page--

SELECT Tools.name as 'Tool', Tools.condition as 'Condition', 
Tools.membership_tier as 'Minimum Required Tier', Tools.rental_fee as 'Rental Fee'
FROM Tools;

--Rentals Page--



--Class Registrations Page--

SELECT COUNT(ClassRegistrations.class_registration_id) as 'Total Class Registrations'
FROM ClassRegistrations;

INSERT INTO ClassRegistrations (member_id, class_id)
VALUES (&member_id, &class_id);
