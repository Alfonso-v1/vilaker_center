/*
    CITATION FOR: selectedClass Variable
    Date: 6/8/26
    Adapted From: ChatGPT
    Originality: The selectedClass var and it's usage was taken from ChatGPT 
    Source URL: chatgpt.com
    Summary of Prompts: ChatGPT was asked to create a way to allow the row to be populated with the correct 'Start Date' and 
        'End Date' after the use made a selection for a class.
*/
import { useState } from "react";

const AddRegistrationRow = ({ memberData, classes, backendURL, refresh, onCancel }) => {
    const [formData, setFormData] = useState({
        member_id: memberData.member_id,
        class_id: ''
    })

    const selectedClass = classes.find(
        (classItem) => String(classItem.class_id) === String(formData.class_id)
    );

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => { 
        try {
            const response = await fetch(backendURL + '/class-registrations/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            alert(data.message);
        
            if (response.ok) {
                console.log('Class registration created succesfully');
                refresh();
                onCancel();
            } else {
                console.error('Error creating registration');
            }
        } catch (error) {
            console.error('Error during class registration: ', error)
        }
    };
    
    return (
        <tr className="add-new-row">
            <td>New</td>
            <td>{memberData.first_name} {memberData.last_name}</td>

            <td>
                <select
                    name="class_id"
                    id="class_id"
                    value={formData.class_id}
                    onChange={handleChange}
                >
                    <option value="">Select a Class</option>
                    {classes.map((classItem) => (
                        <option key={classItem.class_id} value={classItem.class_id}>
                            {classItem.class_name}
                        </option>
                    ))}
                </select>
            </td>

            <td>{selectedClass ? selectedClass['Begins On']: ''}</td>
            <td>{selectedClass ? selectedClass['Ends On']: ''}</td>

            <td className="registration-buttons">
            <button type="button" className="save-button" onClick={handleSubmit}>Register</button>
            <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
            </td>
        </tr>
        );
};

export default AddRegistrationRow;