import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EntryRow({ entry, onEdit, onDelete }: any) {
  const [showConfirm, setShowConfirm] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = async () => {
    try {
      await api.delete('/entries/' + entry.id);
      onDelete(entry.id);
      setShowConfirm(false);
      toast.success('Entry deleted successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Error deleting entry!');
    }
  };

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setShowConfirm(false);
      }
    };
    if (showConfirm) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showConfirm]);

  const baseURL = 'http://localhost:4000';
  const imageUrl = entry.posterUrl ? `${baseURL}${entry.posterUrl}` : null;

  return (
    <tr className="border-t hover:bg-gray-50 relative">
      <td className="px-3 py-2 flex items-center gap-3">
        {imageUrl ? (
          <img src={imageUrl} alt="poster" className="h-12 w-8 object-cover rounded" />
        ) : (
          <div className="h-12 w-8 bg-gray-200 rounded" />
        )}
        <span>{entry.title}</span>
      </td>
      <td className="px-3 py-2">{entry.type}</td>
      <td className="px-3 py-2">{entry.director}</td>
      <td className="px-3 py-2">{entry.budget}</td>
      <td className="px-3 py-2">{entry.location}</td>
      <td className="px-3 py-2">{entry.duration}</td>
      <td className="px-3 py-2">{entry.year}</td>
      <td className="px-3 py-2 text-right relative">
        <button
          onClick={onEdit}
          className="mr-2 px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => setShowConfirm(!showConfirm)}
          className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>

        {/* Small Floating Confirmation Box */}
        {showConfirm && (
          <div
            ref={dialogRef}
            className="absolute right-130 mt-2 bg-white shadow-lg rounded-lg border p-3 w-64 z-10 animate-fade-in"
          >
            <p className="text-sm text-gray-700 mb-3">
              Are you sure you want to delete <b>{entry.title}</b>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
