const UpdateToolForm = ({ tools, memberTiers, backendURL, refresh }) => {
    return (
        <div>
            <h2>Update a Tool</h2>
            <form className='cuForm'>
                <label htmlFor="update_tool_id">Tool to Update: </label>
                <select
                    name='update_tool_id'
                    id='update_tool_id'
                >
                    <option value=''>Select a Tool</option>
                    {tools.map((tool) => (
                        <option key={tool['Tool']} value={tool['Tool']}>
                            {tool['Tool']}
                        </option>
                    ))}
                </select>

                <label htmlFor="update_tool_name">Tool Name: </label>
                <input
                    type='text'
                    name='update_tool_name'
                    id="update_tool_name"
                />

                <label htmlFor="update_tool_condition">Condition: </label>
                <select
                    name='update_tool_condition'
                    id='update_tool_condition'
                >
                    <option value=''>Select Condition</option>
                    <option value='excellent'>Excellent</option>
                    <option value='good'>Good</option>
                    <option value='fair'>Fair</option>
                </select>

                <label htmlFor="update_member_tier">Membership Tier: </label>
                <select
                    name="update_member_tier"
                    id="update_member_tier"
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
                />
                <input type='submit' />
            </form>

        </div>
    );
};

export default UpdateToolForm;