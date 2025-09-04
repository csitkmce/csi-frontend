<script lang="ts">
	import { Linkedin } from "@lucide/svelte";

	let {
        name = "",
        pos = "",
        socialLink = "",
        profileImg = "",
    } : {
        name: string,
        pos: string,
        socialLink: string,
        profileImg: string
    } = $props();
</script>

<div class="m-3 w-40 lg:w-50 flex flex-col items-center border-black border-1 shadow-[4px_4px_black] overflow-hidden">
	<div class="h-40 w-full flex items-center justify-center aspect-1 bg-black overflow-hidden">
        <img alt="profile-img" src={profileImg}/>
    </div>
	<div class="w-full flex flex-col items-start">
        <h2 class="mt-2 mx-2 text-sm font-bold text-white"> {name.length>17?name.split(' ').splice(0,2).join(' '):name}</h2>
	<h3 class="mt-1 mx-2 text-sm text-[#999999]">{pos}</h3>
    </div>
    <div class="mt-auto mb-2 p-2 flex w-full justify-end">
        <div class="p-[4px] bg-white">
            <a href={socialLink} target="_blank"><Linkedin size=20 color="black"/></a>
        </div>
    </div>
</div>
