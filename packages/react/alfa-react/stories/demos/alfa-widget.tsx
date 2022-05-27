import React from 'react';
import { createAlfaWidget } from '../../src';

const AlfaApp = createAlfaWidget({
  name: '@ali/alfa-cloud-cms-app-cloudmonitor',
  locale: 'zh_CN',
  // dynamicConfig: true,
});

const Basic: React.FC<{}> = () => {
  return (
    <AlfaApp />
  );
};

export default Basic;
