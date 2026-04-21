import { NextRequest, NextResponse } from 'next/server';
import { readPlayersData, writePlayersData, createPlayerObject } from '@/utils/playersFileService';
import { Player } from '@/types';

export const dynamic = 'force-dynamic';

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

        const newPlayer = createPlayerObject(body);

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
