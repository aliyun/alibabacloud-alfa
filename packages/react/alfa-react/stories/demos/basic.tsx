import React from 'react';
import { createAlfaApp } from '../../src';

const AlfaApp = createAlfaApp({
  name: '@ali/alfa-cloud-hdm-app-main',
  // version: '0.1.0',
  env: 'pre',
});

const Basic: React.FC<{}> = () => {
  return (
    <AlfaApp />
  );
};

export default Basic;
