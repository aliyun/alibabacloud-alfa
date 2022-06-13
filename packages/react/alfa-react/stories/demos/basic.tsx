import React from 'react';
import { createAlfaApp } from '../../src';

window.ALIYUN_CONSOLE_CONFIG = {
  CHANNEL_REGION_SETTING: {},
  REGIONS: [{
    name: '华北2（北京）',
    physicalList: [{
      id: 'cn-beijing',
    }],
    regionId: 'cn-beijing',
    zoneList: [{
      name: '北京 可用区F',
      zoneId: 'cn-beijing-f',
    }],
  }],
};

window.ALIYUN_CONSOLE_GLOBAL = {
  HOST_GROUP_REGIOINS: {
    OFFICIAL: [{ regionId: 'cn-beijing' }],
  },
};

const AlfaApp = createAlfaApp({
  name: '@ali/alfa-cloud-cms-app-enterprisequikebi',
  // version: '0.1.0',
  env: 'pre',
  sandbox: {
    allowResources: [],
  },
});

const Basic: React.FC<{}> = () => {
  return (
    <AlfaApp />
  );
};

export default Basic;
