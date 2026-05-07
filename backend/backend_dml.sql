/* 
    Data Manipulation Queries for Project Group 21: Vilaker Community Center.
    Authored by Kylee Longaker
    Edited and Approved by Alfonso Vilchez
    Last Edited: 5/6/2026 20:45 
*/

-- User Interaction Denoted by & --

/* SELECT (Display) MemberTiers Options */
SELECT tier_name as Tier, price as 'Monthly Fee', rental_discount * 100 as 'Rental Discount', rental_period as 'Tool Rental Period (Days)'
FROM MemberTiers;

