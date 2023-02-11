<script lang="ts">
	import type { Ability } from '../../model/ability';
	import { onMount } from 'svelte';
	import { Button, TextInput, Text } from '@svelteuidev/core';
	let abilityList: Ability[] = [];
	let inputAbility = '';

	async function getAbility() {
		const rsp = await fetch('http://127.0.0.1:8787/ability/get');
		const rspJson = await rsp.json();
		abilityList = rspJson;
	}

	onMount(async () => {
		getAbility();
	});
</script>

<div class="h-full w-full bg-slate-200 p-8">
	<div class="flex flex-col w-96 gap-2">
		{#each abilityList as ability (ability.id)}
			<div class="flex flex-row justify-between">
				<Text>{ability.abilityname}</Text>
				<Button
					on:click={async () => {
						const rsp = await fetch(`http://127.0.0.1:8787/ability/del?id=${ability.id}`);
						await rsp.json();
						await getAbility();
					}}>删除</Button
				>
			</div>
		{/each}
	</div>
	<div class="flex flex-row w-96 gap-2 mt-8">
		<TextInput class="grow" bind:value={inputAbility} placeholder="输入能力" />
		<Button
			on:click={async () => {
				const rsp = await fetch('http://127.0.0.1:8787/ability/add', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						abilityname: inputAbility
					})
				});
				await rsp.json();
				await getAbility();
				inputAbility = '';
			}}>添加</Button
		>
	</div>
</div>
