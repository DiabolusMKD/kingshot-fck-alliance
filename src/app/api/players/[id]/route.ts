import { NextRequest, NextResponse } from 'next/server';
import {
  readPlayersData,
  writePlayersData,
  findPlayerById,
  updatePlayerObject,
} from '@/utils/playersFileService';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const players = readPlayersData();

    const playerIndex = findPlayerById(players, id);
    if (playerIndex === -1) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const updatedPlayer = updatePlayerObject(id, body, players[playerIndex]);

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

    const playerIndex = findPlayerById(players, id);
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
