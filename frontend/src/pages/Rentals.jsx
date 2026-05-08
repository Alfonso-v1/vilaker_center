import { useState, useEffect, use } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";

function Rentals({ backendURL }) {
  
  const [rentals, setRentals] = useState([]);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/rentals');
      const { rentals } = await response.json();

      setRentals(rentals);
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
                      <TableRow key={index} rowObject={rental} backendURL={backendURL} refreshRentals={getData} />
                    ))}

                </tbody>
      </table>

    </div>
  );
}

export default Rentals;