import { useState } from "react";

const UpdateRegistrationForm = ({ registrationData, classes, backendURL, refresh, onClose }) => {
    const [formData, setFormData] = useState({
        update_registration_id: registrationData['Registration ID'],
        update_class_id: registrationData['Class ID']
    });

    const selectedClass = classes.find(
        (classItem) => String(classItem.class_id) === String(formData.update_class_id)
    );

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(backendURL + '/class-registrations/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Registration updated successfully');
                refresh();
                onClose();
            } else {
                console.error('Error updating Registration');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <div>
            <h2>Update Registration</h2>

            <form className="cuForm" onSubmit={handleSubmit}>
                <label htmlFor="update_class_id">Class:</label>
                <select
                    name="update_class_id"
                    id="update_class_id"
                    value={formData.update_class_id}
                    onChange={handleChange}
                >
                    <option value="">Select A Class</option>
                    {classes.map((classItem) => (
                        <option key={classItem.class_id} value={classItem.class_id}>
                            {classItem.class_name}
                        </option>
                    ))}
                </select>

                <label>Begins On:</label>
                <input
                    type='text'
                    value={selectedClass ? selectedClass['Begins On'] : ""}
                    readOnly
                />

                <label>Ends On:</label>
                <input
                    type='text'
                    value={selectedClass ? selectedClass['Ends On'] : ""}
                    readOnly
                />

                <input type="submit" value="Update Registration" />

                <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateRegistrationForm;