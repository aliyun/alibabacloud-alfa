import React, { useState } from 'react';
import { useAlfaWidget, addGlobalRequestInterceptor } from '../../src';

addGlobalRequestInterceptor((config) => {
  console.info(config);

  return config;
});

const Wrapper = (props) => {
  const AlfaWidget = useAlfaWidget({
    name: '@ali/alfa-cloud-home-widget-cost-overview-new',
    locale: 'en_US',
    env: 'pre',
    delay: () => new Promise((resolve) => setTimeout(() => {
      resolve(undefined);
    }, 5000)),
    priority: 'high',
    sandbox: {
      sandBoxUrl: 'about:blank',
    },
    // dynamicConfig: true,
  });

  if (!AlfaWidget) return null;

  return <AlfaWidget {...props} />;
};

const Basic: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setVisible(!visible)}>btn</button>
      {
        visible ? <Wrapper a={Date.now()} test={() => {}} /> : null
      }
    </div>
  );
};

export default Basic;
