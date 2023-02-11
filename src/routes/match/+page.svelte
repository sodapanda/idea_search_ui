<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, TextInput, Text, Title } from '@svelteuidev/core';
	import type { Role } from '../../model/role';
	import type { Needs } from '../../model/needs';
	import type { Ability } from '../../model/ability';

	let roleList: Role[] = [];
	let currentRole: Role;

	async function getRoleList() {
		const rsp = await fetch('http://127.0.0.1:8787/role/get');
		const rspJson = await rsp.json();
		roleList = rspJson;
	}

	onMount(async () => {
		await getRoleList();
	});
</script>

<div class="h-full w-full bg-slate-200 flex flex-row">
	<div class="shrink-0 w-48 bg-gray-400 flex flex-col gap-2 items-center pt-8">
		{#each roleList as role (role.id)}
			<Button
				class="shrink-0 min-w-[80%]"
				on:click={() => {
					currentRole = role;
				}}>{role.rolename}</Button
			>
		{/each}
	</div>
	<div class="w-full h-full p-8">
		<Title order={2}>{currentRole?.rolename || '未选择'}</Title>
	</div>
</div>
