import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import "../../../../envConfig";

type Game = {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    img_logo_url: string;
}

const steamApiKey = process.env.STEAM_WEB_API_KEY;

export async function GET(request: NextRequest) {
    const steamIDsParam = request.nextUrl.searchParams.get("steamIDs");
    const steamIDs = steamIDsParam ? steamIDsParam.split(",") : [];

    
    const userGames: Record<string, Game[]> = {};

    await Promise.all(steamIDs.map(async (steamID) => {
        const games = await getGames(steamID);
        userGames[steamID] = games;
    }));


    const commonGames = getCommonGamesForUsers(userGames);


    return NextResponse.json({ games: commonGames });


}
async function getGames(steamID: string) {
    try {
        const response = await axios.get(
            `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`, {
                params: {
                    key: steamApiKey,
                    steamid: steamID,
                    format: "json",
                    include_appinfo: true
                }
            }
        );

        const games: Game[] = response.data.response.games.map((game: any) => ({
            appid: game.appid,
            name: game.name,
            playtime_forever: game.playtime_forever,
            img_icon_url: game.img_icon_url,
            img_logo_url: game.img_logo_url
        }));


        return games;
    } catch (error) {
        console.error(`Error fetching games for Steam ID ${steamID}:`, error);
        return [];
    }
}

function getCommonGamesForUsers(userGames : Record<string, Game[]>) {
    const commonGames: Game[] = [];
    const userSteamIDs = Object.keys(userGames);

    for (const game of userGames[userSteamIDs[0]]) {
        const isCommon = userSteamIDs.every((steamID) => {
            return userGames[steamID].some((userGame) => userGame.appid === game.appid);
        });

        if (isCommon) {
            commonGames.push(game);
        }
    }

    return commonGames;

}
