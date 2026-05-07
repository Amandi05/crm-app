import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const statusColors = {
  New: 'bg-yellow-100 text-yellow-800',
  Contacted: 'bg-blue-100 text-blue-800',
  Qualified: 'bg-purple-100 text-purple-800',
  'Proposal Sent': 'bg-orange-100 text-orange-800',
  Won: 'bg-green-100 text-green-800',
  Lost: 'bg-red-100 text-red-800',
};

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadRes, notesRes] = await Promise.all([
          API.get(`/leads/${id}`),
          API.get(`/notes/${id}`),
        ]);
        setLead(leadRes.data);
        setNotes(notesRes.data);
      } catch (err) {
        console.error('Failed to fetch lead details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNoteLoading(true);
    try {
      const res = await API.post(`/notes/${id}`, {
        content: newNote,
        created_by: user?.name || 'Admin',
      });
      setNotes([res.data, ...notes]);
      setNewNote('');
    } catch (err) {
      alert('Failed to add note');
    } finally {
      setNoteLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await API.delete(`/leads/${id}`);
      navigate('/leads');
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Lead not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{lead.lead_name}</h2>
            <p className="text-gray-500">{lead.company_name}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/leads/${id}/edit`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
            >
              Delete
            </button>
            <Link
              to="/leads"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm font-medium"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Lead Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Lead Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{lead.email || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{lead.phone || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Lead Source</p>
              <p className="font-medium">{lead.lead_source || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Assigned To</p>
              <p className="font-medium">{lead.assigned_to || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-100'}`}>
                {lead.status}
              </span>
            </div>
            <div>
              <p className="text-gray-500">Deal Value</p>
              <p className="font-medium">${Number(lead.deal_value || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Created</p>
              <p className="font-medium">{new Date(lead.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="font-medium">{new Date(lead.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Notes</h3>

          <form onSubmit={handleAddNote} className="mb-6">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              placeholder="Add a note about this lead..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={noteLoading}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
            >
              {noteLoading ? 'Adding...' : 'Add Note'}
            </button>
          </form>

          {notes.length === 0 ? (
            <p className="text-gray-400 text-sm">No notes yet. Add one above!</p>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border-l-4 border-blue-400 pl-4 py-2">
                  <p className="text-gray-800 text-sm">{note.content}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    By {note.created_by} · {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LeadDetail;