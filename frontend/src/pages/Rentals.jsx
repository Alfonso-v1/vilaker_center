import { useState, useEffect, use } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import CreateRentalForm from "../components/CreateRentalForm";

function Rentals({ backendURL }) {
  
  const [rentals, setRentals] = useState([]);
  const [tools, setTools] = useState([]);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/rentals');
      const { rentals, tools } = await response.json();

      setRentals(rentals);
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
      <h1>See our past Rentals</h1>

      <table>
                <thead>
                    <tr>
                        {rentals.length > 0 && Object.keys(rentals[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {rentals.map((rental, index) => (
                      <TableRow key={index} rowObject={rental} backendURL={backendURL} refresh={getData} />
                    ))}

                </tbody>
      </table>

      <CreateRentalForm tools={tools} backendURL={backendURL} refresh={getData} />
      
    </div>
  );
}

export default Rentals;