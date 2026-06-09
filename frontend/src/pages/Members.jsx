import { useState, useEffect } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import AddMemberRow from "../components/AddMemberRow";
import UpdateMemberForm from "../components/UpdateMemberForm";
import DeleteMemberForm from "../components/DeleteMemberForm";

function Members({ backendURL }) {

  const [members, setMembers] = useState([]);
  const [memberTiers, setMemberTiers] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [addingMember, setAddingMember] = useState(false);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/members');
      const { members, memberTiers } = await response.json();

      setMembers(members);
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
        <h1>Browse Our Members</h1>
        <p>Add new members or Edit existing members</p>
      </div>
      
      <table>
                <thead>
                    <tr>
            {members.length > 0 && Object.keys(members[0])
                          .filter((header) => header != 'Membership Tier ID')
                          .map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                  {members.map((member, index) => {
                    const displayMember = { ...member };
                    delete displayMember['Membership Tier ID'];
                            
                    return (
                      <TableRow key={index} rowObject={displayMember} backendURL={backendURL} refresh={getData} onEdit={() => setEditingRow(member)} onDelete={setDeletingRow} />
                    )
                  })}
          
                  {addingMember &&
                    <AddMemberRow memberTiers={memberTiers} backendURL={backendURL} refresh={getData} onCancel={() => setAddingMember(false)} />
                  }

                </tbody>
      </table>
      <div className="add-row-section">
        <button type='button' className="add-row-button" onClick={() => setAddingMember(true)}>Add Member</button>
      </div>

      {editingRow &&
        <div className="modal-overlay" onClick={() => setEditingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <UpdateMemberForm memberData={editingRow} memberTiers={memberTiers} backendURL={backendURL} refresh={getData} onClose={() => setEditingRow(null)} />
          </div>
        </div>
      }
      
      {deletingRow &&
        <div className="modal-overlay" onClick={() => setDeletingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <DeleteMemberForm memberData={deletingRow} backendURL={backendURL} refresh={getData} onClose={() => setDeletingRow(null)} />
          </div>
        </div>
      }
    </div>
  );
}

export default Members;
