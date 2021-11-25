import React from 'react';
import { createAlfaApp } from '../../src';

const AlfaApp = createAlfaApp({
  name: '@ali/alfa-cloud-home-app-scene-resource',
  version: '0.1.0',
  env: 'prod',
});

const Basic: React.FC<{}> = () => {
  return (
    <AlfaApp />
  );
};

export default Basic;
