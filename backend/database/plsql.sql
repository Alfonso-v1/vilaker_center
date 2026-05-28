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
    (1, 'free', 0.00, 0.0, 3),
    (2, 'basic', 24.99, 0.5, 7), 
    (3, 'pro', 49.99, 1.0, 14);

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
    ('cordless drill', 'excellent', 1, 10.00),
    ('socket wrench set', 'fair', 1, 15.00),
    ('circular saw', 'good', 2, 20.00),
    ('shop vac', 'excellent', 2, 25.00),
    ('sewing machine', 'good', 3, 35.00),
    ('pressure washer', 'fair', 3, 50.00);

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
    
-- ##################
-- DELETE MEMBER - KL
-- ##################

CREATE OR REPLACE PROCEDURE sp_delete_member(
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

DELIMITER ;
