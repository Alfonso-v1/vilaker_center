import React, { useState } from 'react';

const UpdateRentalForm = ({ rentalData, backendURL, refresh, onClose }) => {

    const [formData, setFormData] = useState({
        update_rental_id: rentalData['Rental ID'],
        update_return_date: rentalData['Date Returned'] || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(backendURL + '/rentals/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Rental updated successfully');
                refresh();
                onClose();
            } else {
                console.error('Error updating rental');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <div>
            <h2>Update Returned Date</h2>
            <p>Member: {rentalData['Member Name']}</p>
            <p>Tool: {rentalData['Tool Rented']}</p>
            <p>Due Date: {rentalData['Due Date']}</p>
            <form className="cuForm" onSubmit={handleSubmit}>
                <input
                    type="hidden"
                    name="update_rental_id"
                    value={formData.update_rental_id}
                />
                <label htmlFor="update_return_date">Returned Date</label>
                <input
                    type="date"
                    name="update_return_date"
                    id="update_return_date"
                    value={formData.update_return_date}
                    onChange={handleChange}
                />
                <input type='submit' value='Update Rental' />
                <button type='button' onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateRentalForm;