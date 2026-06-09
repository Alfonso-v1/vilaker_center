const DeleteClassForm = ({ classData, backendURL, refresh, onClose }) => {
    
    const handleDelete = async () => {
        try {
            await fetch(backendURL + `/classes/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delete_class_id: classData['Class ID'] })
            });
            refresh();
            onClose();
        } catch (error) {
            alert('Error: Could not delete class, ' + error);
        }
    }

    return (
        <div>
            <h2>Delete Class?</h2>
            <p>Class ID: {classData['Class ID']}</p>
            <p>Course Name: {classData['Course']}</p>
            <button type="button" className="confirm-delete-button" onClick={handleDelete}>Delete</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
    )
}

export default DeleteClassForm;