import * as fs from 'fs';
import * as qs from 'querystring';
import axios from 'axios';
import { resolve } from 'path';

export interface IRegisterOption {
  port: number;
  https: boolean;
  host?: string;
}
export const registerConfigToRegistry = (id: string, {
  port,
  https = false
}: IRegisterOption) => {
  const userHome = require('user-home');
  const microAppDir = resolve(userHome, '.breezr/microapp/');
  const registryFile = resolve(microAppDir, 'registry.json');

  if (!fs.existsSync(registryFile)) {
    return;
  }

  const registries = JSON.parse(fs.readFileSync(registryFile, 'utf-8'));
  const query = qs.encode({
    id: id,
    manifest: `${https ? 'https' : 'http'}://localhost:${port}/${id}.manifest.json`
  });

  Object.values(registries).forEach((registryPath) => {
    console.log(`${registryPath}?${query}`)
    axios.get(`${registryPath}?${query}` as string).catch(() => {})
  });

  process.on('exit', () => {
    Object.values(registries).forEach(function (registryPath) {
        var query = qs.encode({
          id: id,
          manifest: ''
        });
        axios.get(registryPath + "?" + query).catch(() => {});
    });
  })
}