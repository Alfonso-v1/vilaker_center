import { useState } from "react";

const UpdateClassForm = ({ classData, backendURL, refresh, onClose }) => {
    const [formData, setFormData] = useState({
        update_class_id: classData['Class ID'],
        update_instructor_name: classData['Instructor'],
        update_course_name: classData['Course'],
        update_course_description: classData['Course Description'],
        update_capacity: classData['Capacity'],
        update_start_date: classData['Start Date Value'],
        update_end_date: classData['End Date Value']
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(backendURL + '/classes/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Class updated succesfully');
                refresh();
                onClose();
            } else {
                console.error('Error updating Class');
            }
        } catch (error) {
            console.error('Error during form submission: ', error)
        }
    };
    
    return (
        <div>
            <h2>Update a Class</h2>
            <form className='cuForm' onSubmit={handleSubmit}>
                <input
                    type="hidden"
                    name="update_class_id"
                    id="update_class_id"
                    value={formData.update_class_id} />

                <label htmlFor="update_instructor_name">Instructor Name: </label>
                <input
                    type='text'
                    name='update_instructor_name'
                    id='update_instructor_name'
                    value={formData.update_instructor_name}
                    onChange={handleChange}
                />

                <label htmlFor="update_class_name">Course Name: </label>
                <input
                    type='text'
                    name='update_course_name'
                    id='update_course_name'
                    value={formData.update_course_name}
                    onChange={handleChange}
                />

                <label htmlFor="update_course_description">Description: </label>
                <textarea
                    name='update_course_description'
                    id='update_course_description'
                    value={formData.update_course_description}
                    onChange={handleChange}
                />

                <label htmlFor="update_capacity">Capacity: </label>
                <input
                    type='number'
                    name='update_capacity'
                    id='update_capacity'
                    value={formData.update_capacity}
                    onChange={handleChange}
                />

                <label htmlFor="update_start_date">Class Start Date: </label>
                <input
                    type='date'
                    name='update_start_date'
                    id='update_start_date'
                    value={formData.update_start_date}
                    onChange={handleChange}
                />

                <label htmlFor="update_end_date">Class End Date: </label>
                <input
                    type='date'
                    name='update_end_date'
                    id='update_end_date'
                    value={formData.update_end_date}
                    onChange={handleChange}
                />

                <input type="submit" />
                <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateClassForm;