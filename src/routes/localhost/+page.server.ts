import { getLHEventsData } from '$lib/server/api/localhost/home';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		lhEventsRecord: await getLHEventsData(fetch)
	};
};
