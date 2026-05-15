import { useState, useEffect } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import UpdateMemberTierForm from "../components/UpdateMemberTierForm";

function MemberTiers({ backendURL }) {
  
  const [memberTiers, setMemberTiers] = useState([]);

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
      <h1>Membership Tiers</h1>
      <p>Browse our current Membership Tier offerings. Ask a staff member about what comes with each tier!</p>

      <table>
                <thead>
                    <tr>
                        {memberTiers.length > 0 && Object.keys(memberTiers[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {memberTiers.map((tier, index) => (
                      <TableRow key={index} rowObject={tier} backendURL={backendURL} refresh={getData} />
                    ))}

                </tbody>
      </table>
      <div className="forms">
      <UpdateMemberTierForm memberTiers={memberTiers} backendURL={backendURL} refresh={getData} />
      </div>
    </div>
  );
}

export default MemberTiers;