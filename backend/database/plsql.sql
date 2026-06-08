-- ##################
-- RESET database
-- ##################
DROP PROCEDURE IF EXISTS sp_reset_db;

DELIMITER //

CREATE PROCEDURE sp_reset_db()
BEGIN

    SET FOREIGN_KEY_CHECKS = 0;

    TRUNCATE TABLE ClassRegistrations;
    TRUNCATE TABLE Rentals;
    TRUNCATE TABLE Classes;
    TRUNCATE TABLE Tools;
    TRUNCATE TABLE Members;
    TRUNCATE TABLE MemberTiers;

    SET FOREIGN_KEY_CHECKS = 1;

    -- ########################
    -- MEMBER TIERS SAMPLE DATA
    -- #########################

    INSERT INTO MemberTiers (membership_tier, tier_name, price, rental_discount, rental_period)
    VALUES
    (1, 'Free', 0.00, 0.0, 3),
    (2, 'Basic', 24.99, 0.5, 7), 
    (3, 'Pro', 49.99, 1.0, 14);

    -- ########################
    -- MEMBERS SAMPLE DATA
    -- #########################

    INSERT INTO Members (first_name, last_name, email, membership_tier)
    VALUES
    ('Judah', 'Howe', 'jhowe@bmail.com', 1),
    ('Brady', 'Simon', 'bsimon@cmail.com', 2),
    ('Max', 'Armstrong', 'aarmstrong@dmail.com', 3),
    ('Abby', 'Mayer', 'amayer@email.com', 1),
    ('Phoebe', 'Foster', 'pfoster@fmail.com', 2),
    ('Isabella', 'Mann', 'imann@gmail.com', 3);

    -- ########################
    -- TOOLS SAMPLE DATA
    -- #########################

    INSERT INTO Tools (name, `condition`, membership_tier, rental_fee)
    VALUES
    ('Cordless Drill', 'Excellent', 1, 10.00),
    ('Socket Wrench Set', 'Fair', 1, 15.00),
    ('Circular Saw', 'Good', 2, 20.00),
    ('Shop Vac', 'Excellent', 2, 25.00),
    ('Sewing Machine', 'Good', 3, 35.00),
    ('Pressure Washer', 'Fair', 3, 50.00);

    -- ########################
    -- RENTALS SAMPLE DATA
    -- #########################

    INSERT INTO Rentals (member_id, tool_id, rent_date, due_date, returned_date, fee)
    VALUES
    ((SELECT member_id FROM Members WHERE first_name = 'Judah' AND last_name = 'Howe'), (SELECT tool_id FROM Tools WHERE name = 'socket wrench set'),
    '2026-04-02', '2026-04-05', '2026-04-04', 15.00),
    ((SELECT member_id FROM Members WHERE first_name = 'Brady' AND last_name = 'Simon'), (SELECT tool_id FROM Tools WHERE name = 'cordless drill'),
    '2026-04-28', '2026-05-05', NULL, 5.00),
    ((SELECT member_id FROM Members WHERE first_name = 'Max' AND last_name = 'Armstrong'), (SELECT tool_id FROM Tools WHERE name = 'sewing machine'),
    '2026-01-02', '2026-01-16', '2026-01-12', 0.00),
    ((SELECT member_id FROM Members WHERE first_name = 'Phoebe' AND last_name = 'Foster'), (SELECT tool_id FROM Tools WHERE name = 'shop vac'),
    '2026-02-02', '2026-02-09', '2026-02-09', 12.50),
    ((SELECT member_id FROM Members WHERE first_name = 'Isabella' AND last_name = 'Mann'), (SELECT tool_id FROM Tools WHERE name = 'socket wrench set'),
    '2026-03-10', '2026-03-17', '2026-03-14', 0.00);

    -- ########################
    -- CLASSES SAMPLE DATA
    -- #########################

    INSERT INTO Classes (instructor_name, class_name, description, capacity, start_date, end_date)
    VALUES
    ('Phillip Lewis', 'Sewing for Beginners', 'An introduction to using a sewing machine and basic stitching fundamentals', 15, '2026-01-01', '2026-01-11'),
    ('Sarah Thomas', 'An Intro to Woodworking', 'Learn about basic wood working tools, joinery, and finishing', 20, '2026-02-01', '2026-02-11'),
    ('Ricardo Martinez', 'Pottery', 'Experience the joy of working with clay and unleash your creativity', 10, '2026-03-01', '2026-03-11'),
    ('Natalie Harris', 'Basic Home Electricity', 'Understand basic electrical safety and switch/outlet installation', 10, '2026-04-01', '2026-04-05'),
    ('Theodore Rutherford', 'Learn 3D Printing', 'Start your 3D printing journey by learning the basics of CAD and MakerWorld', 25, '2026-05-01', '2026-05-15');

    -- ########################
    -- CLASS REGISTRATIONS SAMPLE DATA
    -- #########################

    INSERT INTO ClassRegistrations (member_id, class_id)
    VALUES
    ((SELECT member_id FROM Members WHERE first_name = 'Judah' AND last_name = 'Howe'), (SELECT class_id FROM Classes WHERE class_name = 'Sewing for Beginners')),
    ((SELECT member_id FROM Members WHERE first_name = 'Brady' AND last_name = 'Simon'), (SELECT class_id FROM Classes WHERE class_name = 'An Intro to Woodworking')),
    ((SELECT member_id FROM Members WHERE first_name = 'Max' AND last_name = 'Armstrong'), (SELECT class_id FROM Classes WHERE class_name = 'Pottery')),
    ((SELECT member_id FROM Members WHERE first_name = 'Abby' AND last_name = 'Mayer'), (SELECT class_id FROM Classes WHERE class_name = 'Basic Home Electricity')),
    ((SELECT member_id FROM Members WHERE first_name = 'Phoebe' AND last_name = 'Foster'), (SELECT class_id FROM Classes WHERE class_name = 'Learn 3D Printing'));

END //
    
/* Stored Procedured for Members Page */

DROP PROCEDURE IF EXISTS sp_create_member;
DROP PROCEDURE IF EXISTS sp_update_member;
DROP PROCEDURE IF EXISTS sp_delete_member;

DELIMITER //

-- #############
-- CREATE MEMBER
-- #############

CREATE PROCEDURE sp_create_member(
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_membership_tier TINYINT(1)
)
proc: BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: member not created.' AS RESULT;
    END;

    -- Input Validation --
    IF p_first_name IS NULL THEN
        SELECT 'Error: no first name entered.' AS RESULT;
        LEAVE proc;
    ELSEIF p_last_name IS NULL THEN
        SELECT 'Error: no last name entered.' AS RESULT;
        LEAVE proc;
    ELSEIF p_email IS NULL THEN
        SELECT 'Error: no email address entered.' AS RESULT;
        LEAVE proc;
    ELSEIF p_membership_tier IS NULL THEN
        SELECT 'Error: no membership tier entered' AS RESULT;
        LEAVE proc;
    END IF;
    -- End of Input Valdiation --
    
    START TRANSACTION;

    INSERT INTO `Members`(
        `first_name`,
        `last_name`,
        `email`,
        `membership_tier`
    )
    VALUES (
        p_first_name,
        p_last_name,
        p_email,
        p_membership_tier
    );

    IF ROW_COUNT() > 0 THEN 
        SELECT 'Success: member created.' AS RESULT;
        COMMIT;
        SELECT LAST_INSERT_ID() AS member_id;
    ELSE
        ROLLBACK;
        SELECT 'Error: member could not be created.' AS RESULT;
    END IF;

END proc //

-- #############
-- UPDATE MEMBER
-- #############

CREATE PROCEDURE sp_update_member(
    IN p_member_id INT,
    IN p_email VARCHAR(100),
    IN p_membership_tier TINYINT(1)
)
proc: BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: member not updated.' AS RESULT;
    END;

    -- Input Validation --
    IF (p_email IS NULL AND p_membership_tier IS NULL) OR p_member_id IS NULL THEN
        SELECT "Error: no updates selected." AS RESULT;
        LEAVE proc;
    END IF;
    -- End of Input Validation --

    START TRANSACTION;

    -- Additional Input Validation --
    IF p_email IS NOT NULL THEN
        UPDATE `Members` SET `email` = p_email
            WHERE `member_id` = p_member_id;      
    ELSE
        SELECT 'Error: no email selected.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_membership_tier IS NOT NULL THEN
        UPDATE `Members` SET `membership_tier` = p_membership_tier
            WHERE `member_id` = p_member_id;
    END IF;
    -- End of Additional Input Validation --

    IF ROW_COUNT() > 0 THEN
        COMMIT;
        SELECT "Success: member updated." AS RESULT;
    ELSE
        ROLLBACK;
        SELECT 'Error: member could not be updated.' AS RESULT;
    END IF;

END proc //

-- #############
-- DELETE MEMBER
-- #############

CREATE PROCEDURE sp_delete_member(
    IN p_member_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: member not deleted.' AS RESULT;
    END;

    START TRANSACTION;

    -- Input Validation --
    IF p_member_id IS NOT NULL THEN
        DELETE FROM Members WHERE member_id = p_member_id;

        IF ROW_COUNT() > 0 THEN
            COMMIT;
            SELECT 'Success: member deleted.' AS RESULT;
        ELSE
            ROLLBACK;
            SELECT 'Error: member not deleted.' AS RESULT;
        END IF;

    ELSE
        ROLLBACK;
        SELECT 'Error: member does not exist' AS RESULT;
    END IF;
    -- End of Input Validation --

END //


/* Stored Procedured for Member Tiers Page */

DROP PROCEDURE IF EXISTS sp_update_membertiers;

-- ##################
-- UPDATE MEMBER TIER
-- ##################

CREATE PROCEDURE sp_update_membertiers(
    IN p_member_tier TINYINT(1),
    IN p_price DECIMAL(10, 2),
    IN p_discount DECIMAL(2, 1),
    IN p_rental_period INT
)
proc: BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: member tier not updated.' AS RESULT;
    END;

    -- Input Validation --
    IF p_rental_period IS NULL THEN
        SELECT 'Error: Please specify a rental period.' AS RESULT; 
        LEAVE proc;
    END IF;
    -- End of Input Validation --

    START TRANSACTION;
    
    -- Additional Input Validation & Updates --
    IF p_price IS NULL OR p_price = 0 THEN
        UPDATE `MemberTiers`
        SET `price` = 0
        WHERE `membership_tier` = p_member_tier;
    ELSE
        UPDATE `MemberTiers`
        SET `price` = p_price
        WHERE `membership_tier` = p_member_tier;
    END IF;

    IF p_discount IS NULL OR p_discount = 0 THEN
        UPDATE `MemberTiers`
        SET `rental_discount` = 0
        WHERE `membership_tier` = p_member_tier;
    ELSE
        UPDATE `MemberTiers`
        SET `rental_discount` = p_discount
        WHERE `membership_tier` = p_member_tier;
    END IF;

    IF p_rental_period IS NOT NULL THEN
        UPDATE `MemberTiers` 
        SET `rental_period` = p_rental_period
        WHERE `membership_tier` = p_member_tier;
    ELSE
        UPDATE `MemberTiers`
        SET `rental_period` = 0
        WHERE `membership_tier` = p_member_tier;
    END IF;
    -- End of Additional Input Validation and Updates --

    IF ROW_COUNT() > 0 THEN
        COMMIT;
        SELECT 'Success: member tier updated.' AS RESULT;
    ELSE
        ROLLBACK;
        SELECT 'Error: member tier could not be updated' AS RESULT;
    END IF;

END proc//

/* Stored Procedures for Tools Page */

DROP PROCEDURE IF EXISTS sp_create_tool;
DROP PROCEDURE IF EXISTS sp_update_tool;
DROP PROCEDURE IF EXISTS sp_delete_tool;

-- ###########
-- CREATE TOOL
-- ###########

CREATE PROCEDURE sp_create_tool(
    IN p_name VARCHAR(45),
    IN p_condition VARCHAR(45),
    IN p_tier TINYINT(1),
    IN p_fee DECIMAL(10, 2)
)
proc: BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: tool not created.' AS RESULT;
    END;

    -- Input Validation --
    IF p_name IS NULL THEN
        SELECT 'Please enter the tool name.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_fee IS NULL THEN
        SELECT 'Please enter the rental fee amount.' AS RESULT;
        LEAVE proc;
    END IF;
    -- End of Input Validation --

    START TRANSACTION; 

    INSERT INTO `Tools` (
        name,
        `condition`,
        membership_tier,
        rental_fee
    )
    VALUES (
        p_name,
        p_condition,
        p_tier,
        p_fee
    );

    IF ROW_COUNT() > 0 THEN
        COMMIT;
        SELECT LAST_INSERT_ID() AS tool_id, 'Success: tool created.' AS RESULT;
    ELSE
        ROLLBACK;
        SELECT 'Error: tool could not be created.' AS RESULT; 
    END IF;

END proc//

-- ###########
-- UPDATE TOOL
-- ###########

CREATE PROCEDURE sp_update_tool(
    IN p_tool_id INT,
    IN p_name VARCHAR(45),
    IN p_condition VARCHAR(45),
    IN p_tier TINYINT(1),
    IN p_fee DECIMAL(10,2)
)
proc: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: tool not updated.' AS RESULT;
    END;

    -- Input Validation --
    IF p_name IS NULL THEN
        SELECT 'Please enter the name of the tool.' AS RESULT;
        LEAVE proc;
    ELSEIF p_condition IS NULL THEN
        SELECT 'Please enter the condition of the tool.' AS RESULT;
        LEAVE proc;
    END IF;
    -- End of Input Validation --

    START TRANSACTION;

    UPDATE `Tools` 
    SET 
        `condition` = p_condition,
        `membership_tier` = p_tier,
        `rental_fee` = p_fee
    WHERE `tool_id` = p_tool_id;

    IF ROW_COUNT() > 0 THEN
        COMMIT;
        SELECT 'Success: tool updated.' AS RESULT;
    ELSE
        ROLLBACK;
        SELECT 'Error: tool could not be updated.' AS RESULT;
    END IF;

END proc//

-- ###########
-- DELETE TOOL
-- ###########

CREATE PROCEDURE sp_delete_tool(
    IN p_tool_id INT
)
proc: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: tool not deleted.' AS RESULT;
    END;

    -- Input Validation --
    IF p_tool_id IS NULL THEN
        SELECT 'Error: no tool id entered.' AS RESULT;
        LEAVE proc;
    END IF;
    -- End of Input Validation --

    START TRANSACTION;

    DELETE FROM `Tools` WHERE `tool_id` = p_tool_id;

    IF ROW_COUNT() > 0 THEN
        COMMIT;
        SELECT 'Success: tool deleted.' AS RESULT;
    ELSE
        ROLLBACK;
        SELECT 'Error: tool could not be deleted.' AS RESULT;
    END IF;

END proc//

/* Stored Procedures for Rentals Page */

DROP PROCEDURE IF EXISTS sp_create_rental;
DROP PROCEDURE IF EXISTS sp_update_rental;

-- #############
-- CREATE RENTAL
-- #############

CREATE PROCEDURE sp_create_rental(
    IN p_member_id INT,
    IN p_tool_id INT,
    IN p_rent_date DATE,
    IN p_due_date DATE,
    IN p_return_date DATE,
    IN p_fee DECIMAL(10,2)
)
proc: BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: rental not created.' AS RESULT;
    END;

    IF p_rent_date IS NULL THEN
        SELECT 'Please enter a date of rental.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_due_date IS NULL THEN
        SELECT 'Please enter the due date.' AS RESULT;
        LEAVE proc;
    END IF;

    START TRANSACTION;

    INSERT INTO `Rentals`(
        member_id,
        tool_id,
        rent_date,
        due_date,
        returned_date,
        fee
    )
    VALUES (
        p_member_id,
        p_tool_id,
        p_rent_date,
        p_due_date,
        p_return_date,
        p_fee
    );

    COMMIT;
    SELECT LAST_INSERT_ID() AS rental_id, 'Success: rental created.' AS RESULT;

END proc // 

-- #############
-- UPDATE RENTAL
-- #############

CREATE PROCEDURE sp_update_rental(
    IN p_rental_id INT,
    IN p_return_date DATE
)
proc: BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: rental not updated.' AS RESULT;
    END;

    IF p_rental_id IS NULL THEN
        SELECT 'Error: rental not found.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_return_date IS NULL THEN
        SELECT 'Error: please enter a returned date.' AS RESULT;
        LEAVE proc;
    END IF;

    START TRANSACTION;

    UPDATE `Rentals` SET `returned_date` = p_return_date
        WHERE `rental_id` = p_rental_id;

    COMMIT;
    SELECT 'Success: rental updated.' AS RESULT;

END proc //

/* Stored Procedures for Classes Page */

DROP PROCEDURE IF EXISTS sp_create_class;
DROP PROCEDURE IF EXISTS sp_update_class;
DROP PROCEDURE IF EXISTS sp_delete_class;

-- ############
-- CREATE CLASS
-- ############

CREATE PROCEDURE sp_create_class(
    IN p_instructor VARCHAR(45),
    IN p_class_name VARCHAR(250),
    IN p_description VARCHAR(1000),
    IN p_capacity INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
proc: BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: class not created.' AS RESULT;
    END;

    START TRANSACTION; 

    INSERT INTO `Classes`(
        instructor_name,
        class_name,
        `description`,
        capacity,
        `start_date`,
        end_date
    )
    VALUES (
        p_instructor,
        p_class_name,
        p_description,
        p_capacity,
        p_start_date,
        p_end_date
    );

    SELECT LAST_INSERT_ID() AS class_id; 
    COMMIT;

END proc //

-- ############
-- UPDATE CLASS
-- ############

CREATE PROCEDURE sp_update_class(
    IN p_class_id INT,
    IN p_instructor VARCHAR(45),
    IN p_class_name VARCHAR(250),
    IN p_description VARCHAR(1000),
    IN p_capacity INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
proc: BEGIN
 DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: class not updated.' AS RESULT;
    END;

    START TRANSACTION;
    IF p_instructor IS NOT NULL THEN
        UPDATE `Classes` SET instructor_name = p_instructor WHERE class_id = p_class_id;
    ELSE
        SELECT 'Error: no instructor entered.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_class_name IS NOT NULL THEN
        UPDATE `Classes` SET class_name = p_class_name WHERE class_id = p_class_id;
    ELSE
        SELECT 'Error: no class name entered.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_description IS NOT NULL THEN
        UPDATE `Classes` SET `description` = p_description WHERE class_id = p_class_id;
     ELSE
        SELECT 'Error: no description entered.' AS RESULT;
        LEAVE proc;
    END IF; 

    IF p_capacity IS NOT NULL THEN
        UPDATE `Classes` SET capacity = p_capacity WHERE class_id = p_class_id;
     ELSE
        SELECT 'Error: no capacity entered.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_start_date IS NOT NULL THEN
        UPDATE `Classes` SET `start_date` = p_start_date WHERE class_id = p_class_id;
     ELSE
        SELECT 'Error: no start date entered.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_end_date IS NOT NULL THEN
        UPDATE `Classes` SET end_date = p_end_date WHERE class_id = p_class_id; 
     ELSE
        SELECT 'Error: no end date entered.' AS RESULT;
        LEAVE proc;
    END IF;

    COMMIT;

END proc // 

-- ############
-- DELETE CLASS
-- ############

CREATE PROCEDURE sp_delete_class(
    IN p_class_id INT
)
proc: BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: class not updated.' AS RESULT;
    END;

    IF p_class_id IS NULL THEN
        SELECT 'Error: no class found.' AS RESULT;
        LEAVE proc;
    END IF;

    START TRANSACTION;

    DELETE FROM `Classes` WHERE class_id = p_class_id;
    COMMIT;
    SELECT 'Success: class deleted.' AS RESULT;

END proc // 

/* Stored Procedures for Class Registrations Page */

DROP PROCEDURE IF EXISTS sp_create_registration;
DROP PROCEDURE IF EXISTS sp_delete_registration;

-- #########################
-- CREATE CLASS REGISTRATION
-- #########################

CREATE PROCEDURE sp_create_registration(
    IN p_member_id INT,
    IN p_class_id INT
)
proc: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: class registration not created.' AS RESULT;
    END;

    IF p_member_id IS NULL OR p_class_id IS NULL THEN
        SELECT 'Error: invalid information.' AS RESULT;
        LEAVE proc;
    END IF;

    START TRANSACTION;

    INSERT INTO `ClassRegistrations`(
        member_id,
        class_id
    )
    VALUES(
        p_member_id,
        p_class_id
    );

    SELECT LAST_INSERT_ID() AS class_registration_id;
    COMMIT;

END proc //

-- #########################
-- DELETE CLASS REGISTRATION
-- #########################

CREATE PROCEDURE sp_delete_registration(
    IN p_registration_id INT
)
proc: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: registration not deleted.' AS RESULT;
    END;

    IF p_registration_id IS NULL THEN
        SELECT 'Error: no registration ID found.' AS RESULT;
        LEAVE proc;
    END IF;

    DELETE FROM `ClassRegistrations` WHERE class_registration_id = p_registration_id;
    COMMIT;
END proc // 

DELIMITER ;
