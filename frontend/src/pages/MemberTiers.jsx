import { useState, useEffect, use } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";

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
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {memberTiers.map((tier, index) => (
                      <TableRow key={index} rowObject={tier} backendURL={backendURL} refreshClasses={getData} />
                    ))}

                </tbody>
      </table>
    </div>
  );
}

export default MemberTiers;