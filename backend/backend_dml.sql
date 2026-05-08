/* 
    Data Manipulation Queries for Project Group 21: Vilaker Community Center.
    Authored by Kylee Longaker
    Edited and Approved by Alfonso Vilchez
    Last Edited: 5/7/2026 10:59
*/

-- User Interaction Denoted by & --

--MemberTiers Page --

/* SELECT (Display) MemberTiers Options */
SELECT tier_name as Tier, price as 'Monthly Fee', rental_discount * 100 as 'Rental Discount', 
rental_period as 'Tool Rental Period (Days)'
FROM MemberTiers;

/* UPDATE option to adjust a current member's Member Tier.
        User must enter first name, last name, and email. */
UPDATE Members SET membership_tier = &membership_tier_from_dropdown 
WHERE first_name = &first_name AND last_name = &last_name AND email = &email;

/* CREATE new tier */
INSERT INTO MemberTiers (tier_name, price, rental_discount, rental_period)
VALUES (&tier_name, &price, &rental_discount, &rental_period);

--End of MemberTiers Page--


--Members Page--

/* Display current # of members */
SELECT COUNT(member_id) as 'Number of Members' FROM Members;

/* UPDATE member email address */
UPDATE Members SET email = &email WHERE first_name = &first_name AND last_name = &last_name;

/* CREATE a new member */
INSERT INTO Members (first_name, last_name, email, membership_tier)
VALUES (&first_name, &last_name, &email, &membership_tier_from_dropdown);

/* DELETE future class registrations for a member being deleted */
DELETE FROM ClassRegistrations WHERE member_id = (SELECT member_id FROM Members WHERE 
    first_name = &first_name AND last_name = &last_name AND email = &email)
AND class_id IN (SELECT class_id FROM Classes WHERE end_date >= CURDATE());

/* DELETE a member */
DELETE FROM Members WHERE member_id = (SELECT member_id FROM Members WHERE email = &email AND last_name = &last_name
AND first_name = &first_name);

--End of Members Page


--Classes Page--

/* Display available classes */ 
SELECT class_id as 'Registration ID', instructor_name as Instructor, 
class_name as Course, description as 'Course Description', 
capacity as Capacity, start_date as 'Begins On', end_date as 'Ends On'
FROM Classes;

/* CREATE new class */
INSERT INTO Classes (instructor_name, class_name, description, capacity, start_date, end_date)
VALUES (&instructor_name, &class_name, &description, &capacity, &start_date, &end_date);

/* UPDATE instructor for a course from the class name and start/end dates */
UPDATE Classes SET instructor_name = &instructor_name 
WHERE class_name = &class_name AND start_date = &start_date AND end_date = &end_date;

/* UPDATE start date and end date based on class name and instructor name */
UPDATE Classes SET start_date = &start_date, end_date = &end_date
WHERE class_name = &class_name AND instructor_name = &instructor_name

/* DELETE future registrations for a specific class name (in case class is no longer offered) */
DELETE FROM ClassRegistrations WHERE class_id = (SELECT class_id FROM Classes WHERE 
  class_name = &class_name AND end_date >= CURDATE())

/* DELETE classes by a specific course name (in case course is not longer offered) */
DELETE FROM Classes WHERE class_id = (SELECT class_id FROM Classes WHERE class_name = &class_name);

--End of Classes Page--


--Tools Page--

/* Display available tools and their information */
SELECT Tools.name as 'Tool', Tools.condition as 'Condition', 
Tools.membership_tier as 'Minimum Required Tier', Tools.rental_fee as 'Rental Fee'
FROM Tools;

/* UPDATE tool condition */
UPDATE Tools SET condition = &condition WHERE tool_id = (SELECT tool_id FROM Tools WHERE name = &name)

/* CREATE new tool */
INSERT INTO Tools (name, condition, membership_tier, rental_fee)
VALUES (&name, &condition, (SELECT membership_tier FROM MemberTiers WHERE tier_name = &tier_name), &rental_fee);

/* DELETE tool */
DELETE FROM Tools WHERE tool_id = (SELECT tool_id FROM Tools WHERE name = &name AND
    condition = &condition AND rental_fee = &rental_fee);

--End of Tools Page--


--Rentals Page--

/* Display total number of rentals */
SELECT COUNT(rental_id) as 'Total Rentals' FROM Rentals;

/* CREATE rental (DATEADD learned from W3Schools) */
INSERT INTO Rentals (member_id, tool_id, rent_date, due_date, returned_date, fee)
VALUES(
    --Member--
    (SELECT member_id FROM Members WHERE first_name = &first_name AND last_name = &last_name AND email = &email),
    --Tool--
    (SELECT tool_id FROM Tools WHERE name = &name_from_dropdown),
    --Today's Date (rental date)--
    CURDATE(),
    --Equation to calculate the due date from the member's tier allowment--
    DATEADD(CURDATE(), 
        INTERVAL 
            (SELECT rental_period FROM MemberTiers
            JOIN Members on MemberTiers.membership_tier = Members.membership_tier
            WHERE Members.first_name = &first_name AND Members.last_name = &last_name) 
        DAY),
    --Optional return date (if returned)--
    &returned_date,
    --Fee calculated based on the membership tier discount and the tool fee--
    (SELECT Tools.rental_fee * (1 - MemberTiers.rental_discount)
        FROM Tools
        JOIN Members ON Members.first_name = &first_name AND Members.last_name = &last_name AND Members.email = &email
        JOIN MemberTiers ON Members.membership_tier = MemberTiers.membership_tier
        WHERE Tools.name = &name_from_dropdown)
)

--End of Rentals Page


--Class Registrations Page--

/* Display number of members registered for each class, the remaining spots, and the total capacity for each class */
SELECT class_name as 'Classes',
    COUNT(ClassRegistrations.class_registration_id) as 'Total Class Registrations',
    Classes.capacity - COUNT(ClassRegistrations.class_registration_id) AS 'Remaining Spots',
    Classes.capacity as 'Total Class Capacity'
FROM Classes
LEFT JOIN ClassRegistrations ON Classes.class_id = ClassRegistrations.class_id
GROUP BY Classes.class_id, Classes.capacity, Classes.class_name;

/* CREATE a member registration for a class based on member last name, email, and their desired class name and start date */
INSERT INTO ClassRegistrations (member_id, class_id)
VALUES ((SELECT member_id FROM Members WHERE last_name = &last_name AND email = &email), 
        (SELECT class_id FROM Classes WHERE class_name = &class_name AND start_date = &start_date));

/* DELETE an instance of a registration */
DELETE FROM ClassRegistrations WHERE member_id = (SELECT member_id FROM Members WHERE last_name = &last_name AND email = &email)
AND class_id = (SELECT class_id FROM Classes WHERE class_name = &class_name AND start_date = &start_date);

--End of ClassRegistrations Page--
