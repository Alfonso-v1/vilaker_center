const UpdateRentalForm = ({ rentalData, onClose }) => {
    return (
        <div>
            <h2>Update Returned Date</h2>
            <p>Member: {rentalData['Member Name']}</p>
            <p>Tool: {rentalData['Tool Rented']}</p>
            <p>Due Date: {rentalData['Due Date']}</p>
            <form className="cuForm">
                <label htmlFor="returned_date">Returned Date</label>
                <input type='date' id='returned_date' defaultValue={rentalData?.['Date Returned'] || ''} />
                <input type='submit' value='Update' />
                <button type='button' onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateRentalForm;