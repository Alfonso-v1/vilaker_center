import { useState } from "react";

const UpdateMemberTierForm = ({ tierData, memberTiers, backendURL, refresh, onClose }) => {
    
    const [formData, setFormData] = useState({
        update_tier_id: tierData['Membership Tier ID'],
        update_fee: tierData['Annual Fee'],
        update_discount: tierData['Rental Discount'].replace('%', ''),
        update_rental_period: tierData['Tool Rental Period (Days)']
    })
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(backendURL + '/memberTiers/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Tier updated succesfully');
                refresh();
                onClose();
            } else {
                console.error('Error updating tier');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <div>
            <h2>Update a Tier</h2>
            <p className="tier-description"><strong>Tier: {tierData['Tier']}</strong></p>
            <form className="cuForm" onSubmit={handleSubmit}>

                <input
                    type="hidden"
                    name="update_tier_id"
                    id="update_tier_id"
                    value={formData.update_tier_id} />

                <label htmlFor="update_fee">Annual Fee: </label>
                <input
                    type='number'
                    name='update_fee'
                    id='update_fee'
                    value={formData.update_fee}
                    onChange={handleChange}
                />

                <label htmlFor="update_discount">Rental Discount (%): </label>
                <input
                    type='number'
                    name='update_discount'
                    id='update_discount'
                    value={formData.update_discount}
                    onChange={handleChange}
                />

                <label htmlFor="update_rental_period">Rental Period: </label>
                <input
                    type='number'
                    name='update_rental_period'
                    id='update_rental_period'
                    value={formData.update_rental_period}
                    onChange={handleChange}
                />
                <input type='submit' />
            </form>
        </div>
    );
};

export default UpdateMemberTierForm;