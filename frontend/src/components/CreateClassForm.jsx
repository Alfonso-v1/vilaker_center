const CreateClassForm = ({ backendURL, refresh }) => {
    return (
        <div>
            <h2>Create a Class</h2>

            <form className='cuForm'>
                <label htmlFor="create_instructor_name">Instructor Name: </label>
                <input
                    type='text'
                    name='create_instructor_name'
                    id='create_instructor_name'
                />

                <label htmlFor="create_class_name">Class Name: </label>
                <input
                    type='text'
                    name='create_class_name'
                    id='create_class_name'
                />

                <label htmlFor="create_description">Description: </label>
                <input
                    type='text'
                    name='create_description'
                    id='create_description'
                />
                <label htmlFor="create_capacity">Capacity: </label>
                <input
                    type='number'
                    name='create_capacity'
                    id='create_capacity'
                />

                <label htmlFor="create_start_date">Class Start Date: </label>
                <input
                    type='date'
                    name='create_start_date"'
                    id='create_start_date"'
                />

                <label htmlFor="create_end_date">Class End Date: </label>
                <input
                    type='date'
                    name='create_end_date'
                    id='create_end_date'
                />

                <input type="submit" />
            </form>

        </div>
    );
};

export default CreateClassForm;