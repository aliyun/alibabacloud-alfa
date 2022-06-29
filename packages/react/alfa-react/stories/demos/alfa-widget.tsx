import React, { useState } from 'react';
import { createAlfaWidget } from '../../src';

const AlfaApp = createAlfaWidget({
  name: '@ali/alfa-cloud-cddc-widget-instance-create',
  locale: 'en_US',
  // dynamicConfig: true,
});

const Basic: React.FC<{}> = () => {
  const [, reRender] = useState({});

  return (
    <div>
      <button onClick={() => reRender({})}>btn</button>
      <AlfaApp test={{}} />
    </div>
  );
};

export default Basic;
