const UpdateMemberTierForm = ({ memberTiers, backendURL, refresh }) => {
    return (
        <div>
            <h2>Update a Tier</h2>
            <form className="cuForm">
                <label htmlFor="update_tier">Tier to Update: </label>
                <select
                    name='update_tier'
                    id='update_tier'
                >
                    <option value=''>Select a Tier</option>
                    {memberTiers.map((tier) => (
                        <option key={tier['Tier']} value={tier['Tier']}>
                            {tier['Tier']}
                        </option>
                    ))}
                </select>

                <label htmlFor="update_fee">Annual Fee: </label>
                <input
                    type='number'
                    name='update_fee'
                    id='update_fee'
                />

                <label htmlFor="update_discount">Rental Discount: </label>
                <input
                    type='number'
                    name='update_discount'
                    id='update_discount'
                />

                <label htmlFor="update_rental_period">Rental Period: </label>
                <input
                    type='number'
                    name='update_rental_period'
                    id='update_rental_period'
                />
                <input type='submit' />
            </form>
        </div>
    );
};

export default UpdateMemberTierForm;