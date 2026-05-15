import { useState, useEffect } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import CreateClassForm from "../components/CreateClassForm";
import UpdateClassForm from "../components/UpdateClassForm";

function Classes({ backendURL }) {
  
  const [classes, setClasses] = useState([]);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/classes');
      const { classes } = await response.json();

      setClasses(classes);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Check out our Classes</h1>
      <p>Class Offerings will be updated on a periodic basis. Please check by every so ofter to see what we have to offer!</p>

      <table>
                <thead>
                    <tr>
                        {classes.length > 0 && Object.keys(classes[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {classes.map((oneClass, index) => (
                      <TableRow key={index} rowObject={oneClass} backendURL={backendURL} refresh={getData} />
                    ))}

                </tbody>
      </table>
      <div className="forms">
        <CreateClassForm backendURL={backendURL} refresh={getData} />
        <UpdateClassForm classes={classes} backendURL={backendURL} refresh={getData} />
      </div>
    </div>
  );
}

export default Classes;