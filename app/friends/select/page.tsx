'use client'; // Required for interactivity

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

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
        const steamID = sessionStorage.getItem('steamID')
        const res = await fetch(`/api/steam/friends?steamID=${steamID}`);
        const data = await res.json();
        // console.log(data.player)
        setFriends(data.player); // Expecting { friends: [...] } from API
      } catch (error) {
        console.error('Failed to load friends:', error);
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
    if(Object.keys(selectedFriends).length === 0) {
      alert('Please select at least one friend')
      return
    }
    sessionStorage.setItem('selectedFriends', JSON.stringify(selectedFriends))
    window.location.replace('/friends/common-games')

  }

  return (
    <main className='min-h-screen bg-gray-900 text-white p-6'>
      import Link from 'next/link';

      <Link href='/'>
        <a className='mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition'>
          Go Back
        </a>
      </Link>
  <h1 className='text-2xl font-bold mb-6 text-center'>Select Your Friends</h1>
  <div className='flex flex-wrap gap-4 '>
    {friends.map((friend) => (
      <div
        key={friend.steamid}
        className={`p-4 border rounded-lg shadow-lg cursor-pointer transition-all flex flex-col items-center w-48 h-48
          ${
        selectedFriends.includes(friend.steamid)
          ? 'bg-lime-300 text-black'
          : 'bg-gray-700 hover:bg-gray-600'
          }`}
        onClick={() => toggleSelect(friend.steamid)}
      >
        <Image
          src={friend.avatarfull}
          alt={friend.personaname}
          width={80}
          height={80}
          className='rounded-full mb-2 border-2 border-gray-300'
        />
        <p className='text-lg font-semibold text-center mt-3'>{friend.personaname}</p>
      </div>
    ))}
  </div>
  <div className='flex justify-center mt-6'>
    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={nextStep}>Next</button>
  </div>
  
</main>

  );
}
