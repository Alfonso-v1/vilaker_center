const DeleteRegistrationForm = ({registrationData, backendURL, refresh, onClose}) => {
    const handleDelete = async () => {
        try {
            await fetch(backendURL + `/class-registrations/delete`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({delete_registration_id: registrationData['Registration ID']})
            });
            refresh();
            onClose();
        } catch (error) {
            alert('Error: Could not delete registration.' + error);
        }
    }

    return (
        <div>
            <h2>Delete Registration?</h2>
            <button type='button' className="confirm-delete-button" onClick={handleDelete}>Delete</button>
            <button type='button' className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default DeleteRegistrationForm;