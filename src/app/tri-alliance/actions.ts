"use server";

import { createAllianceEvent } from "@/utils/eventService";

export async function createTriAllianceEvent(startsAt: string) {
  return await createAllianceEvent({
    allianceId: 1,
    eventId: 2,
    startsAt,
    status: "not-started",
    assignments: undefined,
  });
}
