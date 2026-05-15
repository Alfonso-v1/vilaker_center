import DeleteForm from "./DeleteForm";
import UpdateForm from "./UpdateForm";

const TableRow = ({ rowObject, backendURL, refresh, onEdit }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            <td>
            <DeleteForm rowObject={rowObject} backendURL={backendURL} refresh={refresh} />
            <button type='button' onClick={() => onEdit(rowObject)}>Update</button>
            </td>
        </tr>
    );
};

export default TableRow;