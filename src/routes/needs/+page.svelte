<script lang="ts">
	import { roleStore } from '../IdeaStore';
	import { Title, Button, TextInput, Text } from '@svelteuidev/core';
	import { onMount } from 'svelte';
	import type { Needs } from '../../model/needs';

	let needsList: Needs[] = [];
	let intputNeeds = '';

	onMount(async () => {
		getNeeds();
	});

	async function getNeeds() {
		const rsp = await fetch(`http://127.0.0.1:8787/needs/get?role_id=${$roleStore.id}`);
		const data = await rsp.json();
		needsList = data as Needs[];
	}
</script>

<div class="h-full w-full bg-slate-200 p-8">
	<Title order={2}>{$roleStore.rolename}</Title>

	<div class="flex flex-col w-96 gap-2 mt-8">
		{#each needsList as needs (needs.id)}
			<div class="flex flex-row justify-between items-center">
				<Text>
					{needs.needcontent}
				</Text>
				<Button
					on:click={async () => {
						const rsp = await fetch(`http://127.0.0.1:8787/needs/del?id=${needs.id}`);
						const rspJson = await rsp.json();
						console.log(rspJson);
						getNeeds();
					}}>删除</Button
				>
			</div>
		{/each}
	</div>

	<div class="flex flex-row w-96 gap-2 mt-8">
		<TextInput class="grow" bind:value={intputNeeds} placeholder="新需求" />
		<Button
			on:click={async () => {
				const rsp = await fetch('http://127.0.0.1:8787/needs/add', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						roleId: $roleStore.id,
						needContent: intputNeeds
					})
				});
				await rsp.json();
				await getNeeds();
				intputNeeds = '';
			}}
		>
			添加
		</Button>
	</div>
</div>
