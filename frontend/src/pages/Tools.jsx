import { useState, useEffect, use } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";

function Tools({ backendURL }) {
  
  const [tools, setTools] = useState([]);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/tools');
      const { tools } = await response.json();

      setTools(tools);
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
                      <TableRow key={index} rowObject={tool} backendURL={backendURL} refreshTools={getData} />
                    ))}

                </tbody>
      </table>
    </div>
  );
}

export default Tools;