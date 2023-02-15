<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button, Input, P } from 'flowbite-svelte';
	import { roleStore } from '../IdeaStore';
	import type { Role } from '../../model/role';

	let roles: Role[] = [];
	let inputRole = '';

	onMount(async () => {
		getRole();
	});

	async function getRole() {
		const rsp = await fetch('http://127.0.0.1:8787/role/get');
		const rspJson = await rsp.json();
		roles = rspJson;
	}

	async function delRole(roleId: number) {
		await fetch(`http://127.0.0.1:8787/role/del?id=${roleId}`);
	}

	async function addRole(roleNameStr: string) {
		const response = await fetch('http://127.0.0.1:8787/role/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				roleName: roleNameStr
			})
		});

		await response.json();
	}

	const navi = (path: string) => {
		goto(path);
	};
</script>

<div class="h-full w-full bg-slate-200 p-8">
	{#each roles as role (role.id)}
		<div class="flex flex-row items-center gap-2 mb-2 w-96  justify-between">
			<P>{role.rolename}</P>
			<div class="flex flex-row gap-2 [&>*]:shrink-0">
				<Button
					on:click={() => {
						navi('/needs');
						roleStore.set(role);
					}}>需求</Button
				>
				<Button
					on:click={async () => {
						await delRole(role.id);
						await getRole();
					}}>删除</Button
				>
			</div>
		</div>
	{/each}

	<div class="flex flex-row items-center gap-2 mt-4 w-96 justify-between">
		<Input class="grow" bind:value={inputRole} placeholder="角色" />
		<Button class="shrink-0"
			on:click={async () => {
				if (inputRole) {
					await addRole(inputRole);
					await getRole();
					inputRole = '';
				}
			}}>添加</Button
		>
	</div>
</div>
