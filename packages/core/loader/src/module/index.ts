import { Module } from './Module';

export * from './Module';

export type ModuleRecord<T> = [Function?, Function?, Promise<T>?];

export const globalModule = new Module('main', null);
