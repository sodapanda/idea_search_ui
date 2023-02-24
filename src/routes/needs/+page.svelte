<script lang="ts">
	import { roleStore } from '../IdeaStore';
	import { Button, Input, P, Heading } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { Needs } from '../../model/needs';

	let needsList: Needs[] = [];
	let intputNeeds = '';

	onMount(async () => {
		getNeeds();
	});

	async function getNeeds() {
		const rsp = await fetch(`https://ideasearch.leucas.io/needs/get?role_id=${$roleStore.id}`);
		const data = await rsp.json();
		needsList = data as Needs[];
	}
</script>

<div class="h-full w-full bg-slate-200 p-8">
	<Heading>{$roleStore.rolename}</Heading>

	<div class="flex flex-col w-96 gap-2 mt-8">
		{#each needsList as needs (needs.id)}
			<div class="flex flex-row justify-between items-center">
				<P>
					{needs.needcontent}
				</P>
				<Button
					on:click={async () => {
						const rsp = await fetch(`https://ideasearch.leucas.io/needs/del?id=${needs.id}`);
						const rspJson = await rsp.json();
						console.log(rspJson);
						getNeeds();
					}}>删除</Button
				>
			</div>
		{/each}
	</div>

	<div class="flex flex-row w-96 gap-2 mt-8">
		<Input class="grow" bind:value={intputNeeds} placeholder="新需求" />
		<Button class="shrink-0"
			on:click={async () => {
				const rsp = await fetch('https://ideasearch.leucas.io/needs/add', {
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
