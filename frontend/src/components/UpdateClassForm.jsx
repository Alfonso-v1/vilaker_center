const UpdateClassForm = ({ classes, backendURL, refresh }) => {
    return (
        <div>
            <h2>Update a Class</h2>
            <form className='cuForm'>
                <label htmlFor="update_class_id">Class to Update: </label>
                <select
                    name='update_class_id'
                    id='update_class_id'
                >
                    <option value=''>Select a Registration ID</option>
                    {classes.map((oneClass) => (
                        <option key={oneClass['Registration ID']} value={oneClass['Registration ID']}>
                            {oneClass['Registration ID']}
                        </option>
                    ))}
                </select>

                <label htmlFor="update_instructor_name">Instructor Name: </label>
                <input
                    type='text'
                    name='update_instructor_name'
                    id='update_instructor_name'
                />

                <label htmlFor="update_class_name">Class Name: </label>
                <input
                    type='text'
                    name='update_class_name'
                    id='update_class_name'
                />

                <label htmlFor="create_description">Description: </label>
                <input
                    type='text'
                    name='update_description'
                    id='update_description'
                />
                <label htmlFor="update_capacity">Capacity: </label>
                <input
                    type='number'
                    name='update_capacity'
                    id='update_capacity'
                />

                <label htmlFor="update_start_date">Class Start Date: </label>
                <input
                    type='date'
                    name='update_start_date"'
                    id='update_start_date"'
                />

                <label htmlFor="update_end_date">Class End Date: </label>
                <input
                    type='date'
                    name='updateend_date'
                    id='update_end_date'
                />

                <input type="submit" />
            </form>
        </div>
    );
};

export default UpdateClassForm;