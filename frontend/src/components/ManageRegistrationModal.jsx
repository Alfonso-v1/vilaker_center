/*
    CITATION FOR: Modal Component
    Date: 5/14/26
    Adapted From: Claude
    Originality: Framework designed by Claude with additions made to what is displayed in Modal
    Source URL: https://claude.ai/chat/
    Summary of Prompts: Claude was instructed to help with design of a pop-up modal that would allow the user
        to view a table of registrations for a selected member. Claude gave the framework such as div structure
        and open/close functionality as well as styling. The components inside the modal were designed by myself.
*/


import { useState, useEffect } from "react"; 
import TableRow from "./TableRow";
import AddRegistrationRow from "./AddRegistrationRow";
import DeleteRegistrationForm from "./DeleteRegistrationForm";

const ManageRegistrationModal = ({ members, classes, backendURL }) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [deletingRow, setDeletingRow] = useState(null);
    const [addingRegistration, setAddingRegistration] = useState(false);

    const selectedMemberData = members.find(
        (member) => String(member.member_id) === String(selectedMember)
    );

    const refreshRegistrations = async () => {
        if (!selectedMember) return;

        const res = await fetch(`${backendURL}/memberRegistrations/${selectedMember}`);
        const data = await res.json();
        setRegistrations(data.registrations);
    }

    useEffect(() => {
        refreshRegistrations();
    }, [selectedMember, backendURL]);
    
    const closeModal = () => {
        setIsOpen(false);
        setSelectedMember('');
        setRegistrations([]);
        setAddingRegistration(false);
    }
    
    return (
        <div>
            <button onClick={() => setIsOpen(true)}>Manage Your Registrations</button>
            {isOpen && (
                <div className='modal-overlay' onClick={closeModal}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <h2>Manage Registrations</h2>
                        <label htmlFor="selectedMember">Member: </label>
                        <select id="selectedMember" value={selectedMember} onChange={(e) => {
                            setSelectedMember(e.target.value);
                            setAddingRegistration(false);
                            }}>
                            <option value=''>Select a Member</option>
                            {members.map((member) => (
                                <option key={member.member_id} value={member.member_id}>
                                    {member.first_name} {member.last_name}
                                </option>
                            ))}
                            </select>

                            {selectedMember && (
                                <div>
                                    <table> 
                                        <thead>
                                            <tr>
                                                <th>Registration ID</th>
                                                <th>Member Name</th>
                                                <th>Class</th>
                                                <th>Begins On</th>
                                                <th>Ends On</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {registrations.map((registration, index) => (
                                            <TableRow key={index} rowObject={registration} backendURL={backendURL} refresh={refreshRegistrations} showUpdate={false} onDelete={() => setDeletingRow(registration)} />
                                            ))}

                                            {addingRegistration && selectedMemberData && (
                                                <AddRegistrationRow memberData={selectedMemberData} classes={classes} backendURL={backendURL} refresh={refreshRegistrations} onCancel={() => setAddingRegistration(false)} />
                                            )}
                                        </tbody>
                                    </table>

                                    {registrations.length === 0 && !addingRegistration && (
                                        <p>No registrations found for this member.</p>
                                    )}

                                    <div className='add-row-section'>
                                        <button type='button' className='add-row-button' onClick={() => setAddingRegistration(true)}>Add Registration</button>    
                                    </div>
                                    
                                    {deletingRow && 
                                        <div className="modal-overlay" onClick={() => setDeletingRow(null)}>
                                            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                                                <DeleteRegistrationForm registrationData={deletingRow} backendURL={backendURL} refresh={refreshRegistrations} onClose={() => setDeletingRow(null)} />
                                            </div>
                                        </div>
                                    }
                                    
                                </div>
                            )}

                        

                    <button className='modal-close-btn' onClick={closeModal}>Close</button>
                    </div>
                    </div>
            )}
        </div>
    );
};

export default ManageRegistrationModal;

