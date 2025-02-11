"use client"; // Required for interactivity

import { useState, useEffect } from "react";

type Friend = {
  steamid: string;
  personaname: string;
  avatarfull:string;

};

export default function SelectFriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Fetch friends from API
  useEffect(() => {
    async function fetchFriends() {
      try {
        const steamID = sessionStorage.getItem("steamID")
        const res = await fetch(`/api/steam/friends?steamID=${steamID}`);
        const data = await res.json();
        // console.log(data.player)
        setFriends(data.player); // Expecting { friends: [...] } from API
      } catch (error) {
        console.error("Failed to load friends:", error);
      }
    }
    fetchFriends();
  }, []);

  // Toggle friend selection
  const toggleSelect = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId) // Remove if already selected
        : [...prev, friendId] // Add if not selected
        
    );
    console.log(selectedFriends)
  };
  function nextStep() {
    console.log(selectedFriends)
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
  <h1 className="text-2xl font-bold mb-6 text-center">Select Your Friends</h1>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {friends.map((friend) => (
      <div
        key={friend.steamid}
        className={`p-4 border rounded-lg shadow-lg cursor-pointer transition-all flex flex-col items-center
          ${
            selectedFriends.includes(friend.steamid)
              ? "bg-lime-300 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        onClick={() => toggleSelect(friend.steamid)}
      >
        <img
          src={friend.avatarfull}
          alt={friend.personaname}
          className="w-20 h-20 rounded-full mb-2 border-2 border-gray-300"
        />
        <p className="text-lg font-semibold">{friend.personaname}</p>
        <p className="text-sm text-gray-400">{friend.steamid}</p>
      </div>
    ))}
  </div>
  <button onClick={nextStep}>Next</button>
</main>

  );
}
