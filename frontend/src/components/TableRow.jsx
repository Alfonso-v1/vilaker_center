import DeleteForm from "./DeleteForm";

const TableRow = ({ rowObject, backendURL, refresh }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}

            <DeleteForm rowObject={rowObject} backendURL={backendURL} refresh={refresh} />
        </tr>
    );
};

export default TableRow;