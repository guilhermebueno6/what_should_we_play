import { NextRequest, NextResponse } from 'next/server';
import axios from "axios"; 
import '../../../envConfig'

type Friend = {
    steamid:string,
    relationship:string,
    friend_since: number
}
const steamApiKey = process.env.STEAM_WEB_API_KEY

export async function GET(request: NextRequest) {
    const steamID = request.nextUrl.searchParams.get('steamID')
    
    const client = axios.create({
        baseURL: "https://api.steampowered.com/ISteamUser/GetFriendList/v1",
        timeout: 1000,
        headers: {
            'Accept': '*/*',
        }
    });
    const friendResponse = await client.get(`?key=${steamApiKey}&steamid=${steamID}`)

    return NextResponse.json(await getFriendNames(friendResponse.data.friendslist.friends))
}

async function getFriendNames(friends: Friend[], ){
    let csSteamId: string = ""
    const client = getAxiosClient('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v1')
    for (const friend of friends) {
        if(csSteamId) {
            csSteamId += ","
        }
        csSteamId += friend.steamid
    }
    
    
    const clientResponse = await client.get(`?key=${steamApiKey}&steamids=${csSteamId}`)
    const friendResponse = clientResponse.data.response.players

    return friendResponse
}

function getAxiosClient(url: string){
    const client = axios.create({
        baseURL: url,
        timeout: 1000,
        headers: {
            'Accept': '*/*',
        }
    });

    return client
}