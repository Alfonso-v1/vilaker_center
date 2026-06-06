import { useState } from 'react';

const AddMemberRow = ({ memberTiers, backendURL, refreshMembers, onCancel }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        membership_tier: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(backendURL + '/members/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Member created successfully');
                refreshMembers();
                onCancel();
            } else {
                console.log('Error creating member.');
            }
        } catch (error) {
            console.error('Error during member creation:', error);
        }
    };

    return (
        <tr className='add-member-row'>
            <td>New</td>

            <td>
                <input
                    type='text'
                    name='first_name'
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder='First Name'
                />
            </td>

            <td>
                <input
                    type='text'
                    name='last_name'
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder='Last Name'
                />
            </td>

            <td>
                <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Email'
                />
            </td>

            <td>
                <select
                    name='membership_tier'
                    value={formData.membership_tier}
                    onChange={handleChange}
                >
                    <option value=''>Select Tier</option>
                    {memberTiers.map((tier) => (
                        <option
                            key={tier.membership_tier}
                            value={tier.membership_tier}
                        >
                            {tier.tier_name}
                        </option>
                    ))}
                </select>
            </td>

            <td>
                <button type='button' className='save-button' onClick={handleSubmit}>Save</button>
                <button type='button' className='cancel-button' onClick={onCancel}>Cancel</button>
            </td>
        </tr>
    );
};

export default AddMemberRow;
