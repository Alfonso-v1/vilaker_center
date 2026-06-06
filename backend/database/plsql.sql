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
    ('Ricardo Martinez', 'Pottery', 'Experience the joy of working with clay and unleash your creativity', 10, '2026-03-01', '2026-03-01'),
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
    
/* Stored Procedures for Members Page */

DROP PROCEDURE IF EXISTS sp_create_member;
DROP PROCEDURE IF EXISTS sp_update_member;
DROP PROCEDURE IF EXISTS sp_delete_member;

-- ##################
-- CREATE MEMBER - KL
-- ##################

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

    IF p_first_name IS NULL OR p_first_name = '' THEN
        SELECT 'Error: no first name entered.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_last_name IS NULL OR p_last_name = '' THEN
        SELECT 'Error: no last name entered.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_email IS NULL OR p_email = '' THEN
        SELECT 'Error: no email address entered.' AS RESULT;
        LEAVE proc;
    END IF;

    IF p_membership_tier IS NULL THEN
        SET p_membership_tier = 0;
    END IF;
    
    START TRANSACTION;

    INSERT INTO `Members`(
        first_name,
        last_name,
        email,
        membership_tier
    )
    VALUES (
        p_first_name,
        p_last_name,
        p_email,
        p_membership_tier
    );

    COMMIT;
    SELECT 
        LAST_INSERT_ID() AS member_id,
        'Success: member created.' AS RESULT;
END proc //

-- ##################
-- UPDATE MEMBER - KL
-- ##################

CREATE PROCEDURE sp_update_member(
    IN p_member_id INT,
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_membership_tier TINYINT(1)
)
proc: BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: member not updated.' AS RESULT;
    END;

    IF (p_first_name IS NULL AND p_last_name IS NULL AND p_email IS NULL AND p_membership_tier IS NULL) OR p_member_id IS NULL THEN
        SELECT "Error: no updates selected." AS RESULT;
        LEAVE proc;
    END IF;

    START TRANSACTION;

    IF p_first_name IS NOT NULL THEN
        UPDATE `Members` SET `first_name` = p_first_name
            WHERE `member_id` = p_member_id;
    END IF;

    IF p_last_name IS NOT NULL THEN
        UPDATE `Members` SET `last_name` = p_last_name
            WHERE `member_id` = p_member_id;
    END IF;

    IF p_email IS NOT NULL THEN
        UPDATE `Members` SET `email` = p_email
            WHERE `member_id` = p_member_id;
    END IF;

    IF p_membership_tier IS NOT NULL THEN
        UPDATE `Members` SET `membership_tier` = p_membership_tier
            WHERE `member_id` = p_member_id;
    END IF;

    COMMIT;

    SELECT "Success: member updated." AS RESULT;
END proc //

-- ##################
-- DELETE MEMBER - KL
-- ##################

CREATE PROCEDURE sp_delete_member(
    IN button_member_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: member not deleted.' AS RESULT;
    END;

    START TRANSACTION;

    IF button_member_id IS NOT NULL THEN
        DELETE FROM Members WHERE member_id = button_member_id;
        COMMIT;
        SELECT 'Success: member deleted.' AS RESULT;
    ELSE
        ROLLBACK;
        SELECT 'Error: member does not exist' AS RESULT;
    END IF;
END //

/* Stored Procedured for Member Tiers Page */

DROP PROCEDURE IF EXISTS sp_update_membertiers;

CREATE PROCEDURE sp_update_membertiers(
    IN button_member_tier TINYINT(1),
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

    IF p_rental_period IS NULL THEN
        SELECT 'ERROR Please specify a rental period.' AS RESULT; 
        LEAVE proc;
    END IF;

    START TRANSACTION;

    IF p_price IS NULL OR p_price = 0 THEN
        UPDATE `MemberTiers`
        SET `price` = 0
        WHERE `membership_tier` = button_member_tier;
    ELSE
        UPDATE `MemberTiers`
        SET `price` = p_price
        WHERE `membership_tier` = button_member_tier;
    END IF;

    IF p_discount IS NULL OR p_discount = 0 THEN
        UPDATE `MemberTiers`
        SET `rental_discount` = 0
        WHERE `membership_tier` = button_member_tier;
    ELSE
        UPDATE `MemberTiers`
        SET `rental_discount` = p_discount
        WHERE `membership_tier` = button_member_tier;
    END IF;

    UPDATE `MemberTiers` SET `rental_period` = p_rental_period WHERE `membership_tier` = button_member_tier;
    COMMIT; 

    SELECT 'Success: tier updated.' AS RESULT;

END //

-- ####################################
-- UPDATE RENTAL (return date) - KL
-- 'LEAVE' syntax derived from Copilot
-- ####################################

CREATE OR REPLACE PROCEDURE sp_update_rental(
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

END //

DELIMITER ;
