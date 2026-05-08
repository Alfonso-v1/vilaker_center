const CreateToolForm = ({ memberTiers, backendURL, refresh }) => {
    return (
        <div>

            <h2>Add a Tool</h2>
            
            <form className='cuForm'>
                <label htmlFor="create_tool_name">Tool Name: </label>
                <input
                    type='text'
                    name='create_tool_name'
                    id='create_tool_name'
                />

                <label htmlFor="create_tool_condition">Condition: </label>
                <select
                    name='create_tool_condition'
                    id='create_tool_condition'
                >
                    <option value=''>Select Condition</option>
                    <option value='excellent'>Excellent</option>
                    <option value='good'>Good</option>
                    <option value='fair'>Fair</option>
                </select>

                <label htmlFor="create_member_tier">Membership Tier: </label>
                <select
                    name='create_member_tier'
                    id='create_member_tier'
                >
                    <option value=''>Select a Tier</option>
                    {memberTiers.map((memberTier, index) => (
                        <option value={memberTier.membership_tier} key={index}>{memberTier.tier_name}</option>
                    ))}
                </select>

                <label htmlFor="create_rental_fee">Rental Fee: </label>
                <input
                    type='number'
                    name='create_rental_fee'
                    id='create_rental_fee'
                />

                <input type="submit" />
            </form>

        </div>
    );
};

export default CreateToolForm;