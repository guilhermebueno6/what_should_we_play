'use client';

import { useState, useEffect } from 'react';

export default function SteamIDForm() {
  const [steamID, setSteamID] = useState('');

  useEffect(() => {

    const storedSteamID = sessionStorage.getItem('steamID');
    if (storedSteamID) {
      setSteamID(storedSteamID);
    }
  }, []);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    sessionStorage.setItem('steamID', steamID);
    window.location.replace('/friends/select');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Enter Your Steam ID</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Your Steam ID"
            value={steamID}
            onChange={(e) => setSteamID(e.target.value)}
            className="p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Save Steam ID
          </button>
        </form>
      </div>
    </div>
  );
}
