<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, TextInput, Text, Title } from '@svelteuidev/core';
	import type { Role } from '../../model/role';
	import type { Needs } from '../../model/needs';
	import type { Ability } from '../../model/ability';
	import type { Match } from '../../model/match';

	let roleList: Role[] = [];
	let currentRole: Role;

	let needsList: Needs[] = [];
	let abilityList: Ability[] = [];

	async function getRoleList() {
		const rsp = await fetch('http://127.0.0.1:8787/role/get');
		const rspJson = await rsp.json();
		roleList = rspJson;
	}

	async function getNeedsList(roleId: number) {
		const rsp = await fetch(`http://127.0.0.1:8787/needs/get?role_id=${roleId}`);
		const rspJson = await rsp.json();
		needsList = rspJson;
	}

	async function getAbilityList() {
		const rsp = await fetch('http://127.0.0.1:8787/ability/get');
		const rspJson = await rsp.json();
		abilityList = rspJson;
	}

	async function addMatch(match: Match) {
		const rsp = await fetch('http://127.0.0.1:8787/match/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(match)
		});
		await rsp.json();
	}

	onMount(async () => {
		await getRoleList();
		await getAbilityList();
	});

	$: if (currentRole) {
		getNeedsList(currentRole.id).then(() => {
			console.log('updated');
		});
	}
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
	<div class="w-full h-full p-8 overflow-scroll">
		<Title order={2}>{currentRole?.rolename || '未选择'}</Title>
		<div class="w-96 flex flex-row">
			<table class="shrink-0 table-auto border-collapse border border-slate-400 ">
				<tr>
					<th class="border border-slate-300 h-20">能力</th>
				</tr>
				{#each abilityList as ability (ability.id)}
					<tr>
						<td class="border border-slate-300 min-w-[40]">{ability.abilityname}</td>
					</tr>
				{/each}
			</table>
			<table class="w-full table-auto border-collapse border border-slate-400 shrink-0">
				<tr>
					{#each needsList as needs (needs.id)}
						<th class="h-20 border border-slate-300 min-w-[40]">{needs.needcontent}</th>
					{/each}
				</tr>

				{#each abilityList as ability (ability.id)}
					<tr>
						{#each needsList as needs (needs.id)}
							<td class="border border-slate-300 ">
								<div class="w-48">
									<Button
										class="m-auto"
										on:click={() => {
											console.log(`click: ${ability.id} , ${needs.id}`);
											addMatch({
												matchcontent: 'Good',
												abilityid: ability.id,
												needsid: needs.id,
												id: 0
											});
										}}>添加</Button
									>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</table>
		</div>
	</div>
</div>
