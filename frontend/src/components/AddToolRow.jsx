import { useState } from "react";

const AddToolRow = ({ memberTiers, backendURL, refresh, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        condition: '', 
        membership_tier: '',
        rental_fee: ''
    })
    
    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(backendURL + '/tools/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Tool created succesfully');
                refresh();
                onCancel();
            } else {
                console.log('Error creating tool.');
            }
        } catch (error) {
            console.error('Error during tool creation: ', error);
        }
    };

    return (
        <tr className='add-new-row'>
            
            <td>
                <input
                    type='text'
                    name='name'
                    id='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Tool Name'
                />
            </td>

            <td>
                <select
                    name='condition'
                    id='condition'
                    value={formData.condition}
                    onChange={handleChange}
                >
                    <option value=''>Select Condition</option>
                    <option value='Excellent'>Excellent</option>
                    <option value='Good'>Good</option>
                    <option value='Fair'>Fair</option>
                    <option value='Needs Replacement'>Needs Replacement</option>
                </select>
            </td>
                
            <td>
                <select
                    name='membership_tier'
                    id='membership_tier'
                    onChange={handleChange}
                >
                    <option value=''>Select a Tier</option>
                    {memberTiers.map((memberTier, index) => (
                        <option value={memberTier.membership_tier} key={index}>{memberTier.tier_name}</option>
                    ))}
                </select>
            </td>

            <td>
                <input
                    type='number'
                    name='rental_fee'
                    id='rental_fee'
                    value={formData.rental_fee}
                    onChange={handleChange}
                    placeholder='0.00'
                />
            </td>

            <td>
                <button type="button" className="save-button" onClick={handleSubmit}>Save</button>
                <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
            </td>
        </tr>

    );
};

export default AddToolRow;