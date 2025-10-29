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

    // Fixed: safely cast all fields to string
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <input {...register("title", { required: "Title is required" })} placeholder="Title" className="p-2 border rounded w-full" />
      <select {...register("type")} className="p-2 border rounded w-full">
        <option value="Movie">Movie</option>
        <option value="TV Show">TV Show</option>
      </select>
      <input {...register("director")} placeholder="Director" className="p-2 border rounded w-full" />
      <input type="number" {...register("budget")} placeholder="Budget" className="p-2 border rounded w-full" />
      <input {...register("location")} placeholder="Location" className="p-2 border rounded w-full" />
      <input type="number" {...register("duration")} placeholder="Duration (mins)" className="p-2 border rounded w-full" />
      <input type="number" {...register("year")} placeholder="Year" className="p-2 border rounded w-full" />
      <textarea {...register("notes")} placeholder="Notes" className="p-2 border rounded w-full sm:col-span-2 lg:col-span-3" />

      <div className="sm:col-span-2 lg:col-span-3">
        <input type="file" accept="image/*" onChange={handleFile} />
        {preview && <img src={preview} alt="preview" className="mt-2 max-h-40 rounded" />}
      </div>

      <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap justify-end gap-2 mt-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button onClick={onCancel} type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
