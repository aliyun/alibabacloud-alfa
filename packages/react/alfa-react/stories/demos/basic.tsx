import React, { useRef, useEffect } from 'react';
import { createAlfaApp } from '../../src';

const AlfaApp = createAlfaApp({
  name: '@ali/alfa-xxxxxx', 
  version: '1.x',
  env: 'pre',
});

const Basic: React.FC<{}> = () => {
  return (
    <AlfaApp />
  )
}

export default Basic;
