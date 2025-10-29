// import React, { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import EntryForm from "../components/EntryForm";
// import EntryRow from "../components/EntryRow";
// import api from "../api";

// type Entry = {
//   id: number;
//   title: string;
//   type: string;
//   director?: string;
//   budget?: string;
//   location?: string;
//   duration?: string;
//   year?: string;
//   notes?: string;
//   posterUrl?: string;
// };

// export default function EntriesPage() {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [offset, setOffset] = useState(0);
//   const limit = 20;
//   const [hasMore, setHasMore] = useState(true);
//   const observerRef = useRef<HTMLDivElement | null>(null);
//   const [editing, setEditing] = useState<Entry | null>(null);

//   // filters
//   const [q, setQ] = useState('');
//   const [typeFilter, setTypeFilter] = useState('');
//   const [yearFilter, setYearFilter] = useState('');

//   const loadMore = useCallback(async ()=>{
//     if(loading || !hasMore) return;
//     setLoading(true);
//     try{
//       const res = await api.get('/entries', { params: { limit, offset, q, type: typeFilter || undefined, year: yearFilter || undefined }});
//       const data = res.data;
//       setEntries(prev => [...prev, ...data.entries]);
//       setOffset(prev => prev + data.entries.length);
//       if(offset + data.entries.length >= data.total) setHasMore(false);
//     }catch(err){
//       console.error(err);
//     }finally{ setLoading(false); }
//   },[loading, hasMore, offset, q, typeFilter, yearFilter]);

//   // whenever search/filter changes we reset entries
//   useEffect(()=>{
//     setEntries([]);
//     setOffset(0);
//     setHasMore(true);
//   }, [q, typeFilter, yearFilter]);

//   useEffect(()=>{
//     loadMore();
//     // eslint-disable-next-line
//   },[q, typeFilter, yearFilter]);

//   useEffect(() => {
//     if (!observerRef.current) return;
//     const obs = new IntersectionObserver((entriesObs) => {
//       if (entriesObs[0].isIntersecting) loadMore();
//     });
//     obs.observe(observerRef.current);
//     return () => obs.disconnect();
//   }, [loadMore]);

//   const handleCreate = (newEntry: Entry) => {
//     setEntries((prev) => [newEntry, ...prev]);
//   };

//   const handleUpdate = (updated: Entry) => {
//     setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
//     setEditing(null);
//   };

//   const handleDelete = (id: number) => {
//     setEntries((prev) => prev.filter((e) => e.id !== id));
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-8">
//       <h1 className="text-2xl font-bold mb-5 text-gray-800">🎬 Movie Manager</h1>

//       <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
//         <EntryForm
//           onCreate={handleCreate}
//           editing={editing}
//           onUpdate={handleUpdate}
//           onCancel={() => setEditing(null)}
//         />
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-blue-50">
//             <tr>
//               {[
//                 "Title",
//                 "Type",
//                 "Director",
//                 "Budget",
//                 "Location",
//                 "Duration",
//                 "Year",
//                 "Actions",
//               ].map((head) => (
//                 <th
//                   key={head}
//                   className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
//                 >
//                   {head}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-100">
//             {entries.map((e) => (
//               <EntryRow
//                 key={e.id}
//                 entry={e}
//                 onEdit={() => setEditing(e)}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </tbody>
//         </table>

//         <div
//           ref={observerRef}
//           className="p-4 text-center text-sm text-gray-500"
//         >
//           {loading
//             ? "Loading..."
//             : hasMore
//             ? "Scroll to load more"
//             : "No more entries"}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef, useCallback } from "react";
import api from "../api";
import EntryForm from "../components/EntryForm";
import EntryRow from "../components/EntryRow";

type Entry = {
  id: number;
  title: string;
  type: string;
  director?: string;
  budget?: string;
  location?: string;
  duration?: string;
  year?: string;
  notes?: string;
  posterUrl?: string;
};

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);

  // Filters
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await api.get("/entries", {
        params: {
          limit,
          offset,
          q: q || undefined,
          type: typeFilter || undefined,
          year: yearFilter || undefined,
        },
      });
      const data = res.data;
      setEntries((prev) => [...prev, ...data.entries]);
      setOffset((prev) => prev + data.entries.length);
      if (offset + data.entries.length >= data.total) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, q, typeFilter, yearFilter]);

  // Reset when filters/search change
  useEffect(() => {
    setEntries([]);
    setOffset(0);
    setHasMore(true);
  }, [q, typeFilter, yearFilter]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line
  }, [q, typeFilter, yearFilter]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!observerRef.current) return;
    const obs = new IntersectionObserver((entriesObs) => {
      if (entriesObs[0].isIntersecting) loadMore();
    });
    obs.observe(observerRef.current);
    return () => obs.disconnect();
  }, [loadMore]);

  const handleCreate = (newEntry: Entry) => {
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleUpdate = (updated: Entry) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
   <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-5 text-gray-800 text-center md:text-left">
        🎬 Movie Manager
      </h1>

      {/* Entry Form */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow mb-6">
        <EntryForm
          onCreate={handleCreate}
          editing={editing}
          onUpdate={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <input
          type="text"
          placeholder="🔍 Search by title or director..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/4 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="Movie">Movie</option>
          <option value="TV Show">TV Show</option>
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/4 focus:outline-none"
        >
          <option value="">All Years</option>
          {Array.from({ length: 30 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        {(q || typeFilter || yearFilter) && (
          <button
            onClick={() => {
              setQ("");
              setTypeFilter("");
              setYearFilter("");
            }}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm w-full md:w-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Responsive Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              {[
                "Title",
                "Type",
                "Director",
                "Budget",
                "Location",
                "Duration",
                "Year",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {entries.map((e) => (
              <EntryRow
                key={e.id}
                entry={e}
                onEdit={() => setEditing(e)}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        <div
          ref={observerRef}
          className="p-4 text-center text-sm text-gray-500"
        >
          {loading
            ? "Loading..."
            : hasMore
            ? "Scroll to load more"
            : "No more entries"}
        </div>
      </div>
    </div>
  );
}
