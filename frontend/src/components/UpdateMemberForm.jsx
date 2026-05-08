const UpdateMemberForm = ({ members, memberTiers, backendURL, refreshMembers }) => {
    return (
        <div>

            <h2>Update a Member</h2>
            <form className="cuForm">
                <label htmlFor="update_member_id">Member to Update: </label>
                <select
                    name="update_member_id"
                    id="update_member_id"
                >
                    <option value=''>Select a Member</option>
                    {members.map((member) => (
                        <option key={member.member_id} value={member.member_id}>
                            {member['Member ID']} - {member['First Name']} {member['Last Name']}
                        </option>
                    ))}
                </select>

                <label htmlFor="update_member_email">Email: </label>
                <input
                    type='email'
                    name='update_member_email'
                    id="update_member_email"
                />

                <label htmlFor="update_member_tier">Membership Tier: </label>
                <select
                    name="update_member_tier"
                    id="update_member_tier"
                >
                    <option value="">Select a Tier</option>
                    {memberTiers.map((memberTier) => (
                        <option key={memberTier.membership_tier} value={memberTier.membership_tier}>
                            {memberTier.tier_name}
                        </option>
                    ))}
                </select>
                
                <input type="submit" />
            </form>

        </div>
    );
};

export default UpdateMemberForm;