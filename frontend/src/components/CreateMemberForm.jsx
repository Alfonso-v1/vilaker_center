const CreateMemberForm = ({ memberTiers, backendURL, refresh }) => {
    return (
        <div>

            <h2>Create a Member</h2>
            
            <form className='cuForm'>
                <label htmlFor="create_member_fname">First Name: </label>
                <input
                    type='text'
                    name='create_member_fname'
                    id='create_member_fname'
                />

                <label htmlFor="create_member_lname">Last Name: </label>
                <input
                    type='text'
                    name='create_member_lname'
                    id='create_member_lname'
                />

                <label htmlFor="create_member_email">Email: </label>
                <input
                    type='email'
                    name='create_member_email'
                    id='create_member_email'
                />

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

                <input type="submit" />
            </form>

        </div>
    );
};

export default CreateMemberForm;