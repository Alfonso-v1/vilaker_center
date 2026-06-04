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
import CreateClassRegistrationForm from "./CreateClassRegistrationForm";

const ManageRegistrationModal = ({ members, classes, backendURL }) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [newClassId, setNewClassId] = useState('');

    useEffect(() => {
        const loadRegistrations = async () => {
            if (!selectedMember) {
                setRegistrations([]);
                return;
            }
            const res = await fetch(`${backendURL}/memberRegistrations/${selectedMember}`);
            const data = await res.json();
            setRegistrations(data.registrations);
        };
        loadRegistrations();
    }, [selectedMember, backendURL]);
    
    const closeModal = () => {
        setIsOpen(false);
        setSelectedMember('');
        setRegistrations([]);
    }
    
    return (
        <div>
            <button onClick={() => setIsOpen(true)}>Manage Your Registrations</button>
            {isOpen && (
                <div className='modal-overlay' onClick={closeModal}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <h2>Manage Registrations</h2>
                        <label htmlFor="selectedMember">Member: </label>
                        <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                            <option value=''>Select a Member</option>
                            {members.map((member) => (
                                <option key={member.member_id} value={member.member_id}>
                                    {member.first_name} {member.last_name}
                                </option>
                            ))}
                            </select>
                            {registrations.length > 0 &&
                                <table>
                                    <thead>
                                        <tr>
                                            {Object.keys(registrations[0]).map((header, index) => (
                                                <th key={index}>{header}</th>
                                            ))}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {registrations.map((registration, index) => (
                                        <TableRow key={index} rowObject={registration} backendURL={backendURL} refresh={async () => {
                                            const res = await fetch(`${backendURL}/memberRegistrations/${selectedMember}`);
                                            const data = await res.json();
                                            setRegistrations(data.registrations)
                                        }} showUpdate={false} />
                                        ))}
                                    </tbody>
                            </table>
                        }
                        {selectedMember && registrations.length === 0 && (
                            <p>No registrations found for this member.</p>
                        )}
                        {selectedMember &&
                            <CreateClassRegistrationForm classes={classes} member_id={selectedMember} backendURL={backendURL} refresh={async () => {
                                const res = await fetch(`${backendURL}/memberRegistrations/${selectedMember}`);
                                const data = await res.json();
                                setRegistrations(data.registrations);
                                }} />
                        }
                    <button className='modal-close-btn' onClick={closeModal}>Close</button>
                    </div>
                    </div>
            )}
        </div>
    );
};

export default ManageRegistrationModal;

