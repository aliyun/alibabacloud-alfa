import React from 'react';
import { mount } from '@alicloud/console-os-react-portal';
import './index.less';

const App = () => {
  return <div> react 2 </div>
}

export default mount(App, document.getElementById('app'))


