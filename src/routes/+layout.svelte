<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

	$: activeUrl = $page.url.pathname;

	const pages = [
		{ path: '/', title: '首页' },
		{ path: '/roles', title: '角色' },
		{ path: '/alibity', title: '能力' },
		{ path: '/match', title: '匹配' },
		{ path: '/idea', title: 'idea' },
	];
</script>

<div class="w-auto h-screen flex flex-row">
	<div class="w-64 overflow-y-auto h-full flex flex-col items-center gap-2 shrink-0 bg-white">
		<Sidebar>
			<SidebarWrapper>
				<SidebarGroup>
					{#each pages as page (page.path)}
						<SidebarItem label={page.title} href={page.path} active={activeUrl === page.path}>
							<svelte:fragment slot="icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
									/></svg
								>
							</svelte:fragment>
						</SidebarItem>
					{/each}
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</div>
	<slot />
</div>
