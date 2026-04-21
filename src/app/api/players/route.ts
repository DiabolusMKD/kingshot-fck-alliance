import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Player } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'players.json');
console.log('DATA_FILE path:', DATA_FILE);

function readPlayersData(): Player[] {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading players data:', error);
        return [];
    }
}

function writePlayersData(data: Player[]): void {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing players data:', error);
        throw error;
    }
}

export async function GET() {
    try {
        console.log('GET request received for players');
        const players = readPlayersData();
        return NextResponse.json(players);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch players' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const players = readPlayersData();

        const newPlayer: Player = {
            id: body.id,
            playerId: body.playerId,
            name: body.name,
            alias: body.alias,
            swordland: body.swordland,
            triAlliance: body.triAlliance,
            power: body.power,
            active: true,
        };

        players.push(newPlayer);
        writePlayersData(players);

        return NextResponse.json(newPlayer, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create player' },
            { status: 500 }
        );
    }
}
