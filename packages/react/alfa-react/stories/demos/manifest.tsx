import React from 'react';
import { createAlfaApp } from '../../src';

const AlfaApp = createAlfaApp<{}>({
  name: '@ali/alfa-xxxxxx',
  manifest: 'https://dev.g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json',
  dependencies: {},
});

const Demo: React.FC<{}> = () => {
  return (
    <AlfaApp />
  );
};

export default Demo;
