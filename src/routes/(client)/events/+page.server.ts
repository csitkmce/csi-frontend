import { getEventsData } from "$lib/server/api/events";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
    return {
        eventsRecord: await getEventsData(fetch), // pass event.fetch
    };
};
