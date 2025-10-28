import React, { useEffect, useState } from 'react';
import api from '../api';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FormValues = {
  title: string;
  type: string;
  director: string;
  budget: string;
  location: string;
  duration: string;
  year: string;
  notes: string;
};

type Props = {
  onCreate: (e: any) => void;
  editing: any | null;
  onUpdate: (e: any) => void;
  onCancel: () => void;
};

export default function EntryForm({ onCreate, editing, onUpdate, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Load editing data into form
  useEffect(() => {
    if (editing) {
      const { id, createdAt, updatedAt, posterUrl, ...rest } = editing;
      (Object.entries(rest) as [keyof FormValues, any][]).forEach(([k, v]) =>
        setValue(k, String(v))
      );
      setPreview(posterUrl || null);
      setFile(null);
    } else {
      reset({
        title: '',
        type: 'Movie',
        director: '',
        budget: '',
        location: '',
        duration: '',
        year: '',
        notes: '',
      });
      setPreview(null);
      setFile(null);
    }
  }, [editing, reset, setValue]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submitFormData = async (data: FormValues) => {
    const formData = new FormData();

    // ✅ Fixed: safely cast all fields to string
    (Object.entries(data) as [string, string][]).forEach(([k, v]) => {
      formData.append(k, v.toString());
    });

    if (file) formData.append('poster', file);

    try {
      if (editing) {
        const res = await api.patch(`/entries/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onUpdate(res.data);
        toast.success('Entry updated successfully!');
      } else {
        const res = await api.post('/entries', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onCreate(res.data);
        toast.success('Entry added successfully!');
      }

      reset();
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Something went wrong!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitFormData)}
      className="bg-white p-4 rounded grid grid-cols-1 md:grid-cols-3 gap-3"
    >
      {/* Title */}
      <div className="col-span-2">
        <input
          {...register('title', { required: 'Title is required' })}
          placeholder="Title"
          className="p-2 border rounded w-full"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Type */}
      <div>
        <select
          {...register('type', { required: 'Type is required' })}
          className="p-2 border rounded w-full"
        >
          <option value="Movie">Movie</option>
          <option value="TV Show">TV Show</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
      </div>

      {/* Director */}
      <div>
        <input
          {...register('director', { required: 'Director name is required' })}
          placeholder="Director"
          className="p-2 border rounded w-full"
        />
        {errors.director && <p className="text-red-500 text-sm">{errors.director.message}</p>}
      </div>

      {/* Budget */}
      <div>
        <input
          type="number"
          {...register('budget', {
            required: 'Budget is required',
            min: { value: 1, message: 'Budget must be greater than 0' },
          })}
          placeholder="Budget"
          className="p-2 border rounded w-full"
        />
        {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}
      </div>

      {/* Location */}
      <div>
        <input
          {...register('location', { required: 'Location is required' })}
          placeholder="Location"
          className="p-2 border rounded w-full"
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
      </div>

      {/* Duration */}
      <div>
        <input
          type="number"
          {...register('duration', {
            required: 'Duration is required',
            min: { value: 1, message: 'Duration must be greater than 0' },
          })}
          placeholder="Duration (mins)"
          className="p-2 border rounded w-full"
        />
        {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
      </div>

      {/* Year */}
      <div>
        <input
          type="number"
          {...register('year', {
            required: 'Year is required',
            min: { value: 1880, message: 'Enter a valid year' },
            max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
          })}
          placeholder="Year"
          className="p-2 border rounded w-full"
        />
        {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
      </div>

      {/* File Upload */}
      <div className="col-span-2">
        <input type="file" accept="image/*" onChange={handleFile} />
        {preview && <img src={preview} alt="preview" className="mt-2 max-h-40 rounded" />}
      </div>

      {/* Notes */}
      <div className="col-span-3">
        <textarea
          {...register('notes', { required: 'Notes are required' })}
          placeholder="Notes"
          className="p-2 border rounded w-full"
        />
        {errors.notes && <p className="text-red-500 text-sm">{errors.notes.message}</p>}
      </div>

      {/* Buttons */}
      <div className="col-span-3 flex gap-2 justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
