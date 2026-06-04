const TableRow = ({ rowObject, backendURL, refresh, onEdit, onDelete, showUpdate = true, showDelete = true }) => {

    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            {(showUpdate || showDelete) && (
              <td>
                {showUpdate && (
                    <button type='button' className="update-button" onClick={() => onEdit(rowForActions)}>Update</button>
                )}
                
                {showDelete && (
                    <button type='button' className="delete-button" onClick={() => onDelete(rowForActions)}>Delete</button>
                )}
                
            </td>  
            )}
            
        </tr>
    );
};

export default TableRow;