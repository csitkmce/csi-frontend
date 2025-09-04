import { getEventsData } from "$lib/server/api/events";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ }) => {
    return {
        eventsRecord: getEventsData(),
    };
}