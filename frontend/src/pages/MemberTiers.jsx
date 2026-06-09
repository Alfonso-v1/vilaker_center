import { useState, useEffect } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import UpdateMemberTierForm from "../components/UpdateMemberTierForm";

function MemberTiers({ backendURL }) {
  
  const [memberTiers, setMemberTiers] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/memberTiers');
      const { memberTiers } = await response.json();

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
        <h1>Membership Tiers</h1>
        <p>Browse our current Membership Tier offerings. Ask a staff member about what comes with each tier!</p>
      </div>
      

      <table>
        <thead>
          <tr>
            {memberTiers.length > 0 && Object.keys(memberTiers[0])
              .filter((header) => header != 'Membership Tier ID')
              .map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {memberTiers.map((tier, index) => {
            const displayTier = { ...tier };
            delete displayTier['Membership Tier ID'];

            return (
              < TableRow key = { index } rowObject = { displayTier } backendURL = { backendURL } refresh = { getData } onEdit={() => setEditingRow(tier)} showDelete = { false} />
            )
          })}

          </tbody>
      </table>

      {editingRow &&
        <div className="modal-overlay" onClick={() => setEditingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <UpdateMemberTierForm tierData={editingRow} memberTiers={memberTiers} backendURL={backendURL} refresh={getData} onClose={() => setEditingRow(null)} />
          </div>
        </div>
      }
    </div>
  );
}

export default MemberTiers;