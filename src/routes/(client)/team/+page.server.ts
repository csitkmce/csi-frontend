import { getExecomData } from "$lib/server/api/execom";
import type { ExecomList } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ }) => {
    return {
        execomList: getExecomData(2025)
    };
}