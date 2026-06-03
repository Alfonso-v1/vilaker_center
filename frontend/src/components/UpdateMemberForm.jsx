import { useState } from "react";

const UpdateMemberForm = ({ memberData, memberTiers, backendURL, refresh, onClose }) => {
    const [formData, setFormData] = useState({
        update_member_id: memberData['Member ID'],
        update_member_first_name: memberData['First Name'],
        update_member_last_name: memberData['Last Name'],
        update_member_email: memberData['Email'],
        update_member_tier: memberData['Membership Tier ID']
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
            const response = await fetch(backendURL + '/members/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Member updated successfully');
                refresh();
                onClose();
            } else {
                console.error('Error updating Member');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    
    return (
        <div>

            <h2>Update Member</h2>
            <form className="cuForm" onSubmit={handleSubmit}>
                <input
                    type="hidden"
                    name="update_member_id"
                    id="update_member_id"
                    value={formData.update_member_id} />

                <label htmlFor="update_member_first_name">First Name:</label>
                <input
                    type="text"
                    name="update_member_first_name"
                    id="update_member_first_name"
                    value={formData.update_member_first_name}
                    onChange={handleChange}
                />
                
                <label htmlFor="update_member_last_name">Last Name:</label>
                <input
                    type="text"
                    name="update_member_last_name"
                    id="update_member_last_name"
                    value={formData.update_member_last_name}
                    onChange={handleChange}
                />   

                <label htmlFor="update_member_email">Email:</label>
                <input
                    type="text"
                    name="update_member_email"
                    id="update_member_email"
                    value={formData.update_member_email}
                    onChange={handleChange}
                />   

                <label htmlFor="update_member_tier">Membership Tier: </label>
                <select
                    name="update_member_tier"
                    id="update_member_tier"
                    value={formData.update_member_tier}
                    onChange={handleChange}
                >
                    {memberTiers.map((memberTier) => (
                        <option key={memberTier.membership_tier} value={memberTier.membership_tier}>
                            {memberTier.tier_name}
                        </option>
                    ))}
                </select>
                
                <input type="submit" value="Update Member" />

                <button type="button" onClick={onClose}>Cancel</button>
            </form>

        </div>
    );
};

export default UpdateMemberForm;