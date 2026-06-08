import { useState } from "react";

const UpdateToolForm = ({ toolData, memberTiers, backendURL, refresh, onClose }) => {
    const [formData, setFormData] = useState({
        update_tool_id: toolData['tool_id'],
        update_tool_name: toolData['Tool'],
        update_tool_condition: toolData['Condition'],
        update_tool_tier: toolData['Minimum Required Tier ID'],
        update_rental_fee: toolData['Rental Fee']
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
            const response = await fetch(backendURL + '/tools/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Tool updated succesfully');
                refresh();
                onClose();
            } else {
                console.error('Error updating Tool');
            }
        } catch (error) {
            console.error('Error during form submission: ', error)
        }
    };
    
    return (
        <div>
            <h2>Update a Tool</h2>
            <form className='cuForm' onSubmit={handleSubmit}>
                <input
                    type="hidden"
                    name="update_tool_id"
                    id="update_tool_id"
                    value={formData.update_tool_id} />

                <label htmlFor="update_tool_name">Tool Name: </label>
                <input
                    type='text'
                    name='update_tool_name'
                    id="update_tool_name"
                    value={formData.update_tool_name}
                    onChange={handleChange}
                />

                <label htmlFor="update_tool_condition">Condition: </label>
                <select
                    name='update_tool_condition'
                    id='update_tool_condition'
                    value={formData.update_tool_condition}
                    onChange={handleChange}
                >
                    <option value=''>Select Condition</option>
                    <option value='Excellent'>Excellent</option>
                    <option value='Good'>Good</option>
                    <option value='Fair'>Fair</option>
                    <option value='Needs Replacement'>Needs Replacement</option>
                </select>

                <label htmlFor="update_tool_tier">Membership Tier: </label>
                <select
                    name="update_tool_tier"
                    id="update_tool_tier"
                    value={formData.update_tool_tier}
                    onChange={handleChange}
                >
                    <option value="">Select a Tier: </option>
                    {memberTiers.map((memberTier) => (
                        <option key={memberTier.membership_tier} value={memberTier.membership_tier}>
                            {memberTier.tier_name}
                        </option>
                    ))}
                </select>

                <label htmlFor="update_rental_fee">Rental Fee: </label>
                <input
                    type='number'
                    name='update_rental_fee'
                    id='update_rental_fee'
                    value={formData.update_rental_fee}
                    onChange={handleChange}
                />
                <input type='submit' />

                <button type='button' className='cancel-button' onClick={onClose}>Cancel</button>
            </form>

        </div>
    );
};

export default UpdateToolForm;