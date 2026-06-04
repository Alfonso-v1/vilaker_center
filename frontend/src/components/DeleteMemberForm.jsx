const DeleteMemberForm = ({ memberData, backendURL, refresh, onClose }) => {
    
    const handleDelete = async () => {
        try {
            await fetch(`${backendURL}/members/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delete_member_id: memberData['Member ID'] })
            });
            refresh();
            onClose();
        } catch (error) {
            alert('Error: Could not delete member.' + error);
        }
    }
    
    return (
        <div>
            <h2>Delete Member?</h2>
            <p>Member ID: {memberData['Member ID']}</p>
            <p>Name: {memberData['First Name'] + ' ' + memberData['Last Name']}</p>
            <button type='button' className="confirm-delete-button" onClick={handleDelete}>Delete</button>
            <button type='button' className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default DeleteMemberForm;