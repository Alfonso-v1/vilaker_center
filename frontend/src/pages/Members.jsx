import { useState, useEffect, use } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import CreateMemberForm from "../components/CreateMemberForm";
import UpdateMemberForm from "../components/UpdateMemberForm";

function Members({ backendURL }) {

  const [members, setMembers] = useState([]);
  const [memberTiers, setMemberTiers] = useState([]);

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
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {members.map((member, index) => (
                      <TableRow key={index} rowObject={member} backendURL={backendURL} refreshMembers={getData} />
                    ))}

                </tbody>
      </table>
    
      <CreateMemberForm memberTiers={memberTiers} backendURL={backendURL} refreshMembers={getData} />
      <UpdateMemberForm members={members} memberTiers={memberTiers} backendURL={backendURL} refreshMembers={getData} />

    </div>
  );
}

export default Members;
