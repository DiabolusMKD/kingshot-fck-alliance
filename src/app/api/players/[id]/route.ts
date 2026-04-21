import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Player } from '@/types';

export const dynamic = 'force-dynamic'
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'players.json');

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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const players = readPlayersData();

        const playerIndex = players.findIndex((p) => p.id === id);
        if (playerIndex === -1) {
            return NextResponse.json(
                { error: 'Player not found' },
                { status: 404 }
            );
        }

        const updatedPlayer: Player = {
            id,
            playerId: body.playerId,
            name: body.name,
            alias: body.alias,
            swordland: body.swordland,
            triAlliance: body.triAlliance,
            power: body.power,
            active: body.active !== undefined ? body.active : players[playerIndex].active,
        };

        players[playerIndex] = updatedPlayer;
        writePlayersData(players);

        return NextResponse.json(updatedPlayer);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update player' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const players = readPlayersData();

        const playerIndex = players.findIndex((p) => p.id === id);
        if (playerIndex === -1) {
            return NextResponse.json(
                { error: 'Player not found' },
                { status: 404 }
            );
        }

        // Mark player as inactive instead of deleting
        players[playerIndex].active = false;
        writePlayersData(players);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to deactivate player' },
            { status: 500 }
        );
    }
}
