import { useState, useEffect } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import AddClassRow from "../components/AddClassRow";
import UpdateClassForm from "../components/UpdateClassForm";
import DeleteClassForm from "../components/DeleteClassForm";

function Classes({ backendURL }) {
  
  const [classes, setClasses] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [addingClass, setAddingClass] = useState(null);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/classes');
      const { classes } = await response.json();

      setClasses(classes);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Check out our Classes</h1>
      <p>Class Offerings will be updated on a periodic basis. Please check by every so ofter to see what we have to offer!</p>

      <table className="classes-table">
        <thead>
            <tr>
            {classes.length > 0 && Object.keys(classes[0])
              .filter((header) =>
                header !== 'Start Date Value' &&
                header !== 'End Date Value'
              )
              .map((header, index) => (
                <th key={index}>{header}</th>
              ))}
              <th>Actions</th>
            </tr>
        </thead>

        <tbody>
          {classes.map((classItem, index) => {
            const displayClassItem = { ...classItem }
            delete displayClassItem['Start Date Value'];
            delete displayClassItem['End Date Value']

            return (
              <TableRow key={index} rowObject={displayClassItem} backendURL={backendURL} refresh={getData} onEdit={() => setEditingRow(classItem)} onDelete={() => setDeletingRow(classItem)}/>
            )
            })}

          {addingClass &&
            <AddClassRow backendURL={backendURL} refresh={getData} onCancel={() => setAddingClass(null)}/>
          }

        </tbody>
      </table>

      <div className="add-row-section">
        <button type="button" className="add-row-button" onClick={() => setAddingClass(true)}>Add Class</button>
      </div>

      {editingRow &&
        <div className="modal-overlay" onClick={() => setEditingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <UpdateClassForm classData={editingRow} backendURL={backendURL} refresh={getData} onClose={() => setEditingRow(null)} />
          </div>
        </div>
      }

      {deletingRow &&
        <div className="modal-overlay" onClick={() => setDeletingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <DeleteClassForm classData={deletingRow} backendURL={backendURL} refresh={getData} onClose={() => setDeletingRow(null)} />
          </div>
        </div>
      }

    </div>
  );
}

export default Classes;