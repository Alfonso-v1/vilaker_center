import { useState, useEffect, use } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import CreateToolForm from "../components/CreateToolForm";
import UpdateToolForm from "../components/UpdateToolForm";

function Tools({ backendURL }) {
  
  const [tools, setTools] = useState([]);
  const [memberTiers, setMemberTiers] = useState([]);

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
      <h1>Tools</h1>
      <p>View all the tool rentals we currently offer! We're always add new tools to our catalog!</p>
      <table>
                <thead>
                    <tr>
                        {tools.length > 0 && Object.keys(tools[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {tools.map((tool, index) => (
                      <TableRow key={index} rowObject={tool} backendURL={backendURL} refresh={getData} />
                    ))}

                </tbody>
      </table>
      <div className="forms">
        <CreateToolForm memberTiers={memberTiers} backendURL={backendURL} refresh={getData} />
        <UpdateToolForm tools={tools} memberTiers={memberTiers} backendURL={backendURL} refresh={getData} />
      </div>
    </div>
  );
}

export default Tools;