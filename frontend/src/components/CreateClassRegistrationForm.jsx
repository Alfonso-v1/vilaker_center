const CreateClassRegistrationForm = ({ classes, member_id, backendURL, refresh }) => {
    return (
        <div>
            <h2>Register for a Class</h2>
            <form className="cuForm">
                <label htmlFor="create_class_registration">Class: </label>
                <select
                    name='create_class_registration'
                    id='create_class_registration'
                >
                    <option value=''>Select a Class</option>
                    {classes.map((oneClass, index) => (
                    <option value={oneClass.class_name} key={index}>{ oneClass.class_name }</option>
                    ))} 
                </select>
                <label htmlFor="create_member_id">Member ID: </label>
                <input
                    type='number'
                    name='create_member_id'
                    id='create_member_id'
                    value={member_id}
                    readOnly
                />
                <input type='submit' />
            </form>
        </div>
    )
};

export default CreateClassRegistrationForm;