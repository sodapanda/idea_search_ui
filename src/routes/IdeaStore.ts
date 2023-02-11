import { writable } from 'svelte/store';
import type { Role } from '../model/role';

export const roleStore = writable<Role>({ id: 0, rolename: 'empty' });
