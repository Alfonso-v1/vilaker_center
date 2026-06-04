import { useState, useEffect } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import CreateRentalForm from "../components/CreateRentalForm";
import UpdateClassForm from "../components/UpdateClassForm";
import UpdateRentalForm from "../components/UpdateRentalForm";

function Rentals({ backendURL }) {
  
  const [rentals, setRentals] = useState([]);
  const [tools, setTools] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

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
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {rentals.map((rental, index) => (
                      <TableRow key={index} rowObject={rental} backendURL={backendURL} refresh={getData} onEdit={setEditingRow} showDelete={false} />
                    ))}

                </tbody>
      </table>

      {editingRow &&
        <div className="modal-overlay" onClick={() => setEditingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <UpdateRentalForm rentalData={editingRow} backendURL={backendURL} refresh={getData} onClose={() => setEditingRow(null)} />
          </div>
        </div>
      }

      <div className="forms">
        <CreateRentalForm tools={tools} backendURL={backendURL} refresh={getData} />
      </div>
    </div>
  );
}

export default Rentals;