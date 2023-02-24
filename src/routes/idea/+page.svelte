<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import type { Match } from '../../model/match';
	import { onMount } from 'svelte';

	let matchList: Match[] = [];

	onMount(async () => {
		const rsp = await fetch('https://ideasearch.leucas.io/match/get_all');
		const rspJson = (await rsp.json()) as Match[];

		matchList = rspJson;
	});
</script>

<div class="h-full w-full bg-slate-200">
	<Table striped={true}>
		<TableHead>
			<TableHeadCell>产品idea</TableHeadCell>
			<TableHeadCell>用户社区调研</TableHeadCell>
			<TableHeadCell>新技术新可能新洞见</TableHeadCell>
			<TableHeadCell>我们做这个的优势</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each matchList as match}
				<TableBodyRow>
					<TableBodyCell>{match.matchcontent}</TableBodyCell>
					<TableBodyCell>{match.user_community}</TableBodyCell>
					<TableBodyCell>{match.new_insight}</TableBodyCell>
					<TableBodyCell>{match.unfair_advantage}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
