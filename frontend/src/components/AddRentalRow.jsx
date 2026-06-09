/*
    CITATION FOR: Date Procedures
    Date: 6/8/26
    Adapted From: Claude
    Originality: The "Today" var, calculateDueDate, and calculateFee function taken from Claude
    Source URL: https://claude.ai/chat/
    Summary of Prompts: Claude was instructed to help with the development of a function that would help with
        populating the Rent Date and Return Date automatically based on the curret date. Also prompted to help with the development
        of a function that would calculate the rental fee based on the member's discount.
*/

import { useState } from "react";

const AddRentalRow = ({ members, tools, backendURL, refresh, onCancel }) => {

    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        member_id: '',
        tool_id: '',
        rent_date: today,
        due_date: '',
        returned_date: null,
        fee: ''
    });

    const selectedMember = members.find(
        (member) => String(member.member_id) === String(formData.member_id)
    );

    const selectedTool = tools.find(
        (tool) => String(tool.tool_id) === String(formData.tool_id)
    );


    const calculateDueDate = (rentDate, rentalPeriod) => {
        if (!rentDate || rentalPeriod === undefined || rentalPeriod === null) {
            return '';
        }

        const dueDate = new Date(rentDate);
        dueDate.setDate(dueDate.getDate() + Number(rentalPeriod));

        return dueDate.toISOString().split('T')[0];
    }

    const calculateFee = (rentalFee, rentalDiscount) => {
        if (rentalFee === undefined || rentalFee === null || rentalFee === '') {
            return '';
        }

        const fee = Number(rentalFee);
        const discount = rentalDiscount ? Number(rentalDiscount) : 0;

        return (fee * (1 - discount)).toFixed(2);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevState) => {
            const updatedData = {
                ...prevState,
                [name]: value
            };

            const member = members.find(
                (member) => String(member.member_id) === String(updatedData.member_id)
            );

            const tool = tools.find(
                (tool) => String(tool.tool_id) === String(updatedData.tool_id)
            );

            if (name === 'member_id' || name === 'rent_date') {
                updatedData.due_date = member
                    ? calculateDueDate(updatedData.rent_date, member.rental_period)
                    : "";
            }

            if (name === 'member_id' || name === 'tool_id') {
                updatedData.fee = tool
                    ? calculateFee(tool.rental_fee, member?.rental_discount)
                    : "";
            }

            return updatedData;
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(backendURL + '/rentals/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Rental created succesfully.');
                refresh();
                onCancel();
            } else {
                console.log('Error creating rental.');
            }
        } catch (error) {
            console.error('Error during rental creation: ', error);
        }
    }

    return (

        <tr className="add-new-row">
            <td>New</td>

            <td>
                <select
                    name="member_id"
                    id="member_id"
                    value={formData.member_id}
                    onChange={handleChange}
                >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                        <option key={member.member_id} value={member.member_id}>
                            {member.first_name} {member.last_name}
                        </option>
                    ))}
                </select>
            </td>
            
            <td>
                <select
                    name="tool_id"
                    id="tool_id"
                    value={formData.tool_id}
                    onChange={handleChange}
                >
                    <option value="">Select Tool</option>
                    {tools.map((tool) => (
                        <option key={tool.tool_id} value={tool.tool_id}>
                            {tool.name}
                        </option>
                    ))}
                </select>
            </td>

            <td>
                <input
                    type="date"
                    name="rent_date"
                    id="rent_date"
                    value={formData.rent_date}
                    onChange={handleChange}
                />
            </td>
            
            <td>
                <input
                    type="date"
                    name="due_date"
                    id="due_date"
                    value={formData.due_date}
                    readOnly
                />
            </td>

            <td>Not Returned</td>

            <td>
                <input 
                    type="number"
                    name="fee"
                    id="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    readOnly
                />
            </td>

            <td className="table-actions">
                <button type="button" className="save-button" onClick={handleSubmit}>Save</button>
                <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
            </td>
        </tr>
    );
};

export default AddRentalRow;