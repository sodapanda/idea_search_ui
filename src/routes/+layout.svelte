<script lang="ts">
	import '../app.css';
	import { SvelteUIProvider, Button } from '@svelteuidev/core';
	import { goto } from '$app/navigation';

	const pages = [
		{ path: '/', title: '首页' },
		{ path: '/roles', title: '角色' },
		{ path: '/alibity', title: '能力' },
		{ path: '/match', title: '匹配' }
	];

	const navi = (path: string) => {
		goto(path);
	};
</script>

<SvelteUIProvider>
	<div class="bg-slate-100 w-auto h-screen flex flex-row">
		<div
			class="w-64 bg-slate-600 overflow-y-auto h-full flex flex-col [&>*]:shrink-0 [&>*]:min-w-[50%] items-center gap-8"
		>
			<div class="h-0" />
			{#each pages as page (page.path)}
				<Button
					on:click={() => {
						navi(page.path);
					}}>{page.title}</Button
				>
			{/each}
		</div>
		<slot />
	</div>
</SvelteUIProvider>
