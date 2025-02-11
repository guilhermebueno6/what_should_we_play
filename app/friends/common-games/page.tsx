"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

type Game = {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    img_logo_url: string;
}

export default function ShowCommonGamesPage() {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        async function fetchCommonGames() {
            try {
                const userSteamID = sessionStorage.getItem("steamID");
                const selectedFriends = JSON.parse(sessionStorage.getItem("selectedFriends") || "[]");
                const steamIDs = [userSteamID, ...selectedFriends];
                const client = axios.create({
                    timeout: 1000,
                    headers: {
                        'Accept': '*/*',
                    }
                })
                const response = await client.get(`/api/steam/friends/common-games?steamIDs=${steamIDs.join(",")}`);
                setGames(response.data.games);

            } catch (error) {
                console.error("Failed to load common games:", error);
            }
        }
        fetchCommonGames();
    }, []);

    return (
        <main className="min-h-screen bg-gray-900 text-white p-6">
            <Link
                href="/friends/select"
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            >
                Go Back
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-center">Common Games</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {games.map((game) => (
                    <div key={game.appid} className="p-4 border rounded-lg shadow-lg cursor-pointer transition-all flex flex-col items-center game-card">
                        <Image unoptimized src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`} alt={game.name} width={96} height={96} className="w-24 h-24 object-cover rounded-lg" />
                        <h2 className="text-lg font-bold mt-2">{game.name}</h2>
                    </div>
                ))}
            </div>
        </main>
    );

}