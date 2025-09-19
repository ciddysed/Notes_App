import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './Subnotes.css';

const Subnote = ({ taskId, subnotes, setSubnotes }) => {
    const [subnoteValue, setSubnoteValue] = useState('');
    const [localSubnotes, setLocalSubnotes] = useState(subnotes);
    const [editingSubnote, setEditingSubnote] = useState(null);
    const [fetching, setFetching] = useState(false);
    const apiUrl = 'http://localhost:8080/api/subnotes';

    useEffect(() => {
        setLocalSubnotes(subnotes);
    }, [subnotes]);

    useEffect(() => {
        const fetchSubnotes = async () => {
            if (!taskId || fetching) return;
            setFetching(true);
            try {
                const response = await axios.get(`${apiUrl}/task/${taskId}`);
                if (Array.isArray(response.data)) {
                    setLocalSubnotes(response.data);
                    setSubnotes(response.data);
                }
            } catch (error) {
                console.error("Error fetching subnotes:", error);
                alert("An error occurred while fetching subnotes.");
            } finally {
                setFetching(false);
            }
        };

        fetchSubnotes();
    }, [taskId, setSubnotes, fetching]);

    const handleAddSubnote = async () => {
        if (!subnoteValue) {
            alert("Please enter a subnote.");
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/task/${taskId}`, {
                subnote: subnoteValue,
            });
            const newSubnote = response.data;
            setLocalSubnotes(prev => [...prev, newSubnote]);
            setSubnotes(prevSubnotes => [...prevSubnotes, newSubnote]);
            setSubnoteValue('');
        } catch (error) {
            console.error("Error adding subnote:", error);
            alert("An error occurred while adding the subnote.");
        }
    };

    const handleDeleteSubnote = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this subnote?");
        if (!confirmDelete) return;
    
        try {
            await axios.delete(`${apiUrl}/${id}`);
            setLocalSubnotes(prev => prev.filter(subnote => subnote.subnoteID !== id));
            setSubnotes(prevSubnotes => prevSubnotes.filter(subnote => subnote.subnoteID !== id));
        } catch (error) {
            console.error("Error deleting subnote:", error);
            alert("An error occurred while deleting the subnote.");
        }
    };

    const handleEditSubnote = (subnote) => {
        setEditingSubnote({ ...subnote });
    };

    const handleUpdateSubnote = async () => {
        if (!editingSubnote) return;

        try {
            const response = await axios.put(`${apiUrl}/${editingSubnote.subnoteID}`, {
                subnote: editingSubnote.subnote,
            });
            const updatedSubnote = response.data;

            setLocalSubnotes(prev => 
                prev.map(sub => sub.subnoteID === updatedSubnote.subnoteID ? updatedSubnote : sub)
            );
            setSubnotes(prevSubnotes => 
                prevSubnotes.map(sub => sub.subnoteID === updatedSubnote.subnoteID ? updatedSubnote : sub)
            );

            setEditingSubnote(null); // Clear edit mode
        } catch (error) {
            console.error("Error updating subnote:", error);
            alert("An error occurred while updating the subnote.");
        }
    };

    return (
        <div className="subnotes-section">
            <div className="subnotes-display">
                <ul className="subnotes-list">
                    {Array.isArray(localSubnotes) && localSubnotes.length > 0 ? (
                        localSubnotes.map((subnote) => (
                            <li key={subnote.subnoteID} className="subnote-item">
                                {editingSubnote && editingSubnote.subnoteID === subnote.subnoteID ? (
                                    <input
                                        type="text"
                                        value={editingSubnote.subnote}
                                        onChange={(e) =>
                                            setEditingSubnote({ ...editingSubnote, subnote: e.target.value })
                                        }
                                        className="edit-input"
                                    />
                                ) : (
                                    <p>{subnote.subnote}</p>
                                )}
                                {editingSubnote && editingSubnote.subnoteID === subnote.subnoteID ? (
                                    <button className="update-btn" onClick={handleUpdateSubnote}>Save</button>
                                ) : (
                                    <div className="task-actions">
                                        <button className="edit-btn2" onClick={() => handleEditSubnote(subnote)}>Edit</button>
                                        <button className="delete-btn2" onClick={() => handleDeleteSubnote(subnote.subnoteID)}>Delete</button>
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <li>No subnotes available.</li>
                    )}
                </ul>
            </div>
            <div className="subnote-input">
                <input
                    type="text"
                    value={subnoteValue}
                    onChange={(e) => setSubnoteValue(e.target.value)}
                    placeholder="Add a subnote"
                />
                <button onClick={handleAddSubnote}>Add</button>
            </div>
        </div>
    );
};

Subnote.propTypes = {
    taskId: PropTypes.number.isRequired,
    subnotes: PropTypes.array.isRequired,
    setSubnotes: PropTypes.func.isRequired,
};

export default Subnote;
