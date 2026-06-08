const DeleteToolForm = ({ toolData, backendURL, refresh, onClose }) => {

    const handleDelete = async () => {
        try {
            await fetch(`${backendURL}/tools/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({delete_tool_id: toolData['tool_id']})
            });
            refresh();
            onClose();
        } catch (error) {
            alert('Error: Could not delete tool.' + error);
        }
    }


    return (
        <div>
            <h2>Delete Tool?</h2>
            <p>Tool ID: {toolData['tool_id']}</p>
            <p>Tool Name: {toolData['Tool']}</p>
            <button type="button" className="confirm-delete-button" onClick={handleDelete}>Delete</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default DeleteToolForm;