<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Input, P, Modal, Heading } from 'flowbite-svelte';
	import type { Role } from '../../model/role';
	import type { Needs } from '../../model/needs';
	import type { Ability } from '../../model/ability';
	import type { Match } from '../../model/match';

	let roleList: Role[] = [];
	let currentRole: Role;

	let needsList: Needs[] = [];
	let abilityList: Ability[] = [];

	let matchTable: Match[][] = [];

	let opened = false;
	let inputIdea = '';
	let editIdea: Match;

	async function getRoleList() {
		const rsp = await fetch('http://127.0.0.1:8787/role/get');
		const rspJson = await rsp.json();
		roleList = rspJson;
	}

	async function getAbilityList() {
		const rsp = await fetch('http://127.0.0.1:8787/ability/get');
		const rspJson = await rsp.json();
		abilityList = rspJson;
	}

	async function getNeedsList(roleId: number) {
		const rsp = await fetch(`http://127.0.0.1:8787/needs/get?role_id=${roleId}`);
		const rspJson = await rsp.json();
		needsList = rspJson;
	}

	async function buildMatchTable(roleId: number) {
		await getNeedsList(roleId);

		const rsp = await fetch(`http://127.0.0.1:8787/match/get?roleid=${roleId}`);
		const matchJson: Match[] = (await rsp.json()) as Match[];

		const tmpMatchTable = [];

		for (const ability of abilityList) {
			const matchList: Match[] = [];
			for (const needs of needsList) {
				const match: Match = {
					abilityid: ability.id,
					needsid: needs.id,
					matchcontent: '',
					id: 0
				};

				for (const dbMatch of matchJson) {
					if (dbMatch.abilityid === ability.id && dbMatch.needsid === needs.id) {
						match.matchcontent = dbMatch.matchcontent;
					}
				}
				matchList.push(match);
			}
			tmpMatchTable.push(matchList);
		}

		matchTable = tmpMatchTable;
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

	function closeModal() {
		opened = false;
	}

	$: if (currentRole) {
		buildMatchTable(currentRole.id).then(() => {
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
		<Heading>{currentRole?.rolename || '未选择'}</Heading>
		{#if needsList.length === 0}
			<Heading order={4}>无需求</Heading>
		{/if}
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

				{#each matchTable as matchList}
					<tr>
						{#each matchList as match}
							<td class="border border-slate-300 ">
								<div class="w-48">
									{#if match.matchcontent}
										<P class="m-auto w-fit">{match.matchcontent}</P>
									{:else}
										<Button
											class="m-auto"
											on:click={() => {
												editIdea = match;
												opened = true;
											}}>添加</Button
										>
									{/if}
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</table>
		</div>
	</div>
</div>

<Modal {opened} on:close={closeModal} title="请输入idea">
	<div>
		<Input bind:value={inputIdea} placeholder="输入idea" />
		<Button
			on:click={async () => {
				if (inputIdea) {
					await addMatch({
						...editIdea,
						matchcontent: inputIdea
					});
					await buildMatchTable(currentRole.id);
					opened = false;
				} else {
				}
			}}>确定</Button
		>
	</div>
</Modal>
