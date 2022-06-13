import React from 'react';
import { createAlfaWidget } from '../../src';

const Widget = createAlfaWidget({
  name: '@ali/widget-home-promotion',
  version: '1.x',
  central: false,
});

const Basic: React.FC<{}> = () => {
  return (
    <Widget />
  );
};

export default Basic;
