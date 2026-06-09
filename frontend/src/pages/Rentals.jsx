import { useState, useEffect, use } from "react"; // Importing useState for managing state in the component
import TableRow from "../components/TableRow";
import UpdateRentalForm from "../components/UpdateRentalForm";
import AddRentalRow from "../components/AddRentalRow";

function Rentals({ backendURL }) {
  
  const [rentals, setRentals] = useState([]);
  const [tools, setTools] = useState([]);
  const [members, setMembers] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [addingRental, setAddingRental] = useState(false);

  const getData = async function () {
    try {

      const response = await fetch(backendURL + '/rentals');
      const { rentals, tools, members } = await response.json();

      setRentals(rentals);
      setTools(tools);
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

          {addingRental &&
            <AddRentalRow members={members} tools={tools} backendURL={backendURL} refresh={getData} onCancel={() => setAddingRental(false)} />
          }  
        </tbody>
      </table>

      <div className="add-row-section">
        <button type='button' className="add-row-button" onClick={() => setAddingRental(true)}>Add Rental</button>
      </div>

      {editingRow &&
        <div className="modal-overlay" onClick={() => setEditingRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <UpdateRentalForm rentalData={editingRow} backendURL={backendURL} refresh={getData} onClose={() => setEditingRow(null)} />
          </div>
        </div>
      }

    </div>
  );
}

export default Rentals;