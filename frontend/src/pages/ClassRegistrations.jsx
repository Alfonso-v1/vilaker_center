import { useState, useEffect, use } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import CreateClassRegistrationForm from "../components/CreateClassRegistrationForm";
import ManageRegistrationModal from "../components/ManageRegistrationModal";

function ClassRegistrations({ backendURL }) {
  
  const [classRegistrations, setClassRegistrations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/classRegistrations');
      const { classRegistrations, classes, members } = await response.json();

      setClassRegistrations(classRegistrations);
      setClasses(classes);
      setMembers(members);
      
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Manage Class Registrations</h1>
      <p>See the number of open spaces left for each class offering.</p>
      <table>
                <thead>
                    <tr>
                        {classRegistrations.length > 0 && Object.keys(classRegistrations[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {classRegistrations.map((registration, index) => (
                      <TableRow key={index} rowObject={registration} backendURL={backendURL} refresh={getData} />
                    ))}

                </tbody>
      </table>
      <div>
        <ManageRegistrationModal members={members} classes={classes} backendURL={backendURL} />
      </div>
    </div>
  );
}

export default ClassRegistrations;