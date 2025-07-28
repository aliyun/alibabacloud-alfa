/**
 * title: "AlfaWidget Demo"
 * description: ""
 */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createAlfaWidget, addGlobalRequestInterceptor } from '../src';

type Story = StoryObj<typeof Demo>;

addGlobalRequestInterceptor((config) => {
  console.info(config);

  return config;
});

const AlfaWidget = createAlfaWidget({
  name: '@ali/alfa-cloud-home-widget-cost-overview-new',
  locale: 'en_US',
  env: 'pre',
  version: 'x-v2',
  delay: () => new Promise((resolve) => setTimeout(() => {
    resolve(undefined);
  }, 5000)),
  // priority: 'high',
  // dynamicConfig: true,
});

const Wrapper = (props) => {
  if (!AlfaWidget) return null;

  return <AlfaWidget {...props} />;
};

function Demo() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <AlfaWidget />
      <AlfaWidget />
      {/* <button onClick={() => setVisible(!visible)}>btn</button>
      {
        visible ? <Wrapper a={Date.now()} test={() => {}} /> : null
      } */}
    </div>
  );
}

const meta: Meta<typeof Demo> = {
  component: Demo,
};

export const Widget: Story = {
  args: {},
  render: () => <Demo />,
};

export default meta;
