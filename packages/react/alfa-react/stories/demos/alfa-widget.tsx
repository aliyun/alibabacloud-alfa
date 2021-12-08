import React from 'react';
import { createAlfaWidget } from '../../src';

const AlfaApp = createAlfaWidget({
  name: '@ali/alfa-cloud-home-widget-alfa-widget-demo',
  version: '0.1.0',
  // env: 'prod',
  // dynamicConfig: true,
});

const Basic: React.FC<{}> = () => {
  return (
    <AlfaApp />
  );
};

export default Basic;
