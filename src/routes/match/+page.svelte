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
	let inputMatchContent = '';
	let inputUserCommunity = '';
	let inputNewInsight = '';
	let inputUnfairAdvantage = '';
	let editIdea: Match;

	async function getRoleList() {
		const rsp = await fetch('https://ideasearch.leucas.io/role/get');
		const rspJson = await rsp.json();
		roleList = rspJson;
	}

	async function getAbilityList() {
		const rsp = await fetch('https://ideasearch.leucas.io/ability/get');
		const rspJson = await rsp.json();
		abilityList = rspJson;
	}

	async function getNeedsList(roleId: number) {
		const rsp = await fetch(`https://ideasearch.leucas.io/needs/get?role_id=${roleId}`);
		const rspJson = await rsp.json();
		needsList = rspJson;
	}

	async function buildMatchTable(roleId: number) {
		await getNeedsList(roleId);

		const rsp = await fetch(`https://ideasearch.leucas.io/match/get?roleid=${roleId}`);
		const matchJson: Match[] = (await rsp.json()) as Match[];

		const tmpMatchTable = [];

		for (const ability of abilityList) {
			const matchList: Match[] = [];
			for (const needs of needsList) {
				const match: Match = {
					abilityid: ability.id,
					needsid: needs.id,
					matchcontent: '',
					user_community: '',
					new_insight: '',
					unfair_advantage: '',
					id: 0
				};

				for (const dbMatch of matchJson) {
					if (dbMatch.abilityid === ability.id && dbMatch.needsid === needs.id) {
						match.matchcontent = dbMatch.matchcontent;
						match.id = dbMatch.id;
					}
				}
				matchList.push(match);
			}
			tmpMatchTable.push(matchList);
		}

		matchTable = tmpMatchTable;
	}

	async function addMatch(match: Match) {
		const rsp = await fetch('https://ideasearch.leucas.io/match/add', {
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
										<Button
											on:click={async () => {
												const rsp = fetch(`https://ideasearch.leucas.io/match/del?match_id=${match.id}`);
												await (await rsp).json();
												buildMatchTable(currentRole.id);
											}}>删除</Button
										>
									{:else}
										<Button
											class="m-auto w-fit"
											on:click={() => {
												editIdea = match;
												opened = true;
											}}>详情</Button
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

<Modal bind:open={opened} title="请输入idea">
	<div>
		<Input bind:value={inputMatchContent} placeholder="输入idea" />
		<Input bind:value={inputUserCommunity} placeholder="在社区里跟真实用户聊过吗" />
		<Input bind:value={inputNewInsight} placeholder="新技术新可能新洞见" />
		<Input bind:value={inputUnfairAdvantage} placeholder="我来做的不公平优势" />
		<Button
			class="mt-2"
			on:click={async () => {
				if (inputMatchContent) {
					await addMatch({
						...editIdea,
						matchcontent: inputMatchContent,
						user_community: inputUserCommunity,
						new_insight: inputNewInsight,
						unfair_advantage: inputUnfairAdvantage
					});
					await buildMatchTable(currentRole.id);
					opened = false;
				} else {
				}
			}}>确定</Button
		>
	</div>
</Modal>
