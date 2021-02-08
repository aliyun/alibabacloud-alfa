import React from 'react';
import { createAlfaApp } from '../../src';

const AlfaApp = createAlfaApp({ name: '@ali/alfa-cloud-sas-app-overview', env: 'pre', sandbox: {disable: true}});

const Basic: React.FC<{}> = () => {
  return (
    <AlfaApp />
  )
}

export default Basic;
