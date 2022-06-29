import React, { useEffect, useState } from 'react';
import { createAlfaWidget } from '../../src';

const AlfaWidget = createAlfaWidget({
  name: '@ali/alfa-cloud-home-widget-alfa-widget-demo',
  locale: 'en_US',
  loading: false,
  // dynamicConfig: true,
});

const Wrapper = (props) => {
  return <AlfaWidget {...props} />
}

const Basic: React.FC<{}> = () => {
  const [, reRender] = useState();

  useEffect(() => {
    reRender({});
  }, []);

  return (
    <div>
      <button onClick={() => reRender({})}>btn</button>
      <Wrapper a={Date.now()} test={() => {}} />
    </div>
  );
};

export default Basic;
