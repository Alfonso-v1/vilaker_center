import { useState, useEffect } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import AddToolRow from "../components/AddToolRow";
import UpdateToolForm from "../components/UpdateToolForm";
import DeleteToolForm from "../components/DeleteToolForm";

function Tools({ backendURL }) {
  
  const [tools, setTools] = useState([]);
  const [memberTiers, setMemberTiers] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [addingTool, setAddingTool] = useState(null);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/tools');
      const { tools, memberTiers } = await response.json();

      setTools(tools);
      setMemberTiers(memberTiers);

    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="page-description">
        <h1>Tools</h1>
        <p>View all the tool rentals we currently offer! We're always add new tools to our catalog!</p>
      </div>
      
      <table>
        <thead>
          <tr>
            {tools.length > 0 && Object.keys(tools[0])
              .filter((header) =>
                header !== 'tool_id' &&
                header !== 'Minimum Required Tier ID'
              )
              .map((header, index) => (
                <th key={index}>{header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tools.map((tool, index) => {
            const displayTool = { ...tool };
            delete displayTool['tool_id'];
            delete displayTool['Minimum Required Tier ID'];

            return (
            <TableRow key={index} rowObject={displayTool} backendURL={backendURL} refresh={getData} onEdit={() => setEditingRow(tool)} onDelete={() => setDeletingRow(tool)} />
            )
          })}
          
          {addingTool &&
            <AddToolRow memberTiers={memberTiers} backendURL={backendURL} refresh={getData} onCancel={() => setAddingTool(false)} />
          }
        </tbody>
      </table>
      <div className="add-row-section">
        <button type="button" className="add-row-button" onClick={() => setAddingTool(true)}>Add Tool</button>
      </div>

      {editingRow &&
        <div className="modal-overlay" onClick={() => setEditingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <UpdateToolForm toolData={editingRow} memberTiers={memberTiers} backendURL={backendURL} refresh={getData} onClose={() => setEditingRow(null)} />
          </div>
        </div>
      }

      {deletingRow &&
        <div className="modal-overlay" onClick={() => setDeletingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <DeleteToolForm toolData={deletingRow} backendURL={backendURL} refresh={getData} onClose={() => setDeletingRow(null)} />
          </div>
        </div>
      }
    </div>
  );
}

export default Tools;