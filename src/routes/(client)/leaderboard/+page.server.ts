import { getLeaderboard } from "$lib/server/api/leaderboard";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = () => {
    const leaderboard = getLeaderboard();
    return {
        leaderboard: leaderboard
    };
}