import { useState } from "react";

const AddClassRow = ({ backendURL, refresh, onCancel }) => {
    
    const [formData, setFormData] = useState({
        instructor_name: '',
        class_name: '',
        description: '',
        capacity: '',
        start_date: '',
        end_date: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(backendURL + 'classes/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Class created succesfully');
                refresh();
                onCancel();
            } else {
                console.log('Error creating tool.');
            }
        } catch (error) {
            console.error('Error during class creation: ', error)
        }
    };

    return (
        <tr className="add-new-row">
            <td>New</td>
            
            <td>
                <input
                    type='text'
                    name='instructor_name'
                    id='instructor_name'
                    value={formData.instructor_name}
                    onChange={handleChange}
                    placeholder="Instructor"
                />
            </td>

            <td>
                <input
                    type='text'
                    name='class_name'
                    id='class_name'
                    value={formData.class_name}
                    onChange={handleChange}
                    placeholder="Course Name"
                />
            </td>
        
            <td>
                <input
                    type='text'
                    name='description'
                    id='description'
                    value={formData.description}
                    placeholder="Description"
                />
            </td>

            <td>
                <input
                    type='number'
                    name='capacity'
                    id='capacity'
                    value={formData.capacity}
                    placeholder="Capacity"
                />
            </td>


            <td>
                <input
                    type='date'
                    name='start_date'
                    id='start_date'
                    value={formData.start_date}
                />
            </td>

            <td>
                <input
                    type='date'
                    name='end_date'
                    id='end_date'
                    value={formData.end_date}
                />
            </td>

            <td className="add-class-buttons">
                <button type="button" className="save-button" onClick={handleSubmit}>Save</button>
                <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
            </td>
        </tr>
        
            

    );
};

export default AddClassRow;