const CreateRentalForm = ({ tools, backendURL, refresh }) => {
    return (
        <div>
            <h2>Create a Rental</h2>
            <form className="cuForm">
                <label htmlFor="create_member_id">Member ID: </label>
                <input
                    type='number'
                    name='create_member_id'
                    id='create_member_id'
                />
                <label htmlFor="create_tool_rental">Tool: </label>
                <select
                    name='create_tool_rental'
                    id='create_tool_rental'
                >
                    <option value=''>Select a Tool</option>
                    {tools.map((tool, index) => (
                    <option value={tool.name} key={index}>{ tool.name }</option>
                    ))} 
                </select>
                <label htmlFor="create_rent_date">Rent Date: </label>
                <input
                    type='date'
                    name='create_rent_date'
                    id='create_rent_date'
                />
                <label htmlFor="create_rent_fee">Fee Paid: </label>
                <input
                    type='number'
                    name='create_rent_fee'
                    id='create_rent_fee'
                />
                <input type='submit' />
            </form>
        </div>
    );
};

export default CreateRentalForm;