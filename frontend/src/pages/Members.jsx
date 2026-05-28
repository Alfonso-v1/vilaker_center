import { useState, useEffect } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import CreateMemberForm from "../components/CreateMemberForm";
import UpdateMemberForm from "../components/UpdateMemberForm";
import DeleteMemberForm from "../components/DeleteMemberForm";

function Members({ backendURL }) {

  const [members, setMembers] = useState([]);
  const [memberTiers, setMemberTiers] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

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
      <h1>Browse Our Members</h1>
      <p>Add new members or Edit existing members</p>
      <table>
                <thead>
                    <tr>
                        {members.length > 0 && Object.keys(members[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {members.map((member, index) => (
                      <TableRow key={index} rowObject={member} backendURL={backendURL} refresh={getData} onEdit={setEditingRow} onDelete={setDeletingMember} />
                    ))}

                </tbody>
      </table>

      {editingRow &&
        <div className="modal-overlay" onClick={() => setEditingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>

          </div>
        </div>
      }
      
      {deletingMember &&
        <div className="modal-overlay" onClick={() => setDeletingMember(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <DeleteMemberForm memberData={deletingMember} backendURL={backendURL} refresh={getData} onClose={() => setDeletingMember(null)} />
          </div>
        </div>
      }

      <div className="forms">
        <CreateMemberForm memberTiers={memberTiers} backendURL={backendURL} refresh={getData} />
        <UpdateMemberForm members={members} memberTiers={memberTiers} backendURL={backendURL} refresh={getData} />
      </div>
    </div>
  );
}

export default Members;
