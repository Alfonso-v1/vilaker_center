const TableRow = ({ rowObject, backendURL, refresh, onEdit, onDelete }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            <td>
                <button type='button' onClick={() => onDelete(rowObject)}>Delete</button>
                <button type='button' onClick={() => onEdit(rowObject)}>Update</button>
            </td>
        </tr>
    );
};

export default TableRow;