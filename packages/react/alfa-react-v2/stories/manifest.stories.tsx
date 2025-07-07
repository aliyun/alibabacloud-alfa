/**
 * title: "AlfaWidget Demo"
 * description: ""
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createAlfaApp } from '../src';

type Story = StoryObj<typeof Demo>;

const AlfaApp = createAlfaApp({
  name: '@ali/alfa-xxxxxx',
  manifest: 'https://g.idptcloud01cdn.com/haitu/aliyun-ebsops-app-qos-portal/0.8.9/ali-alfa-aliyun-ebsops-app-qos-portal.manifest.json',
  dependencies: {},
});

function Demo() {
  return (
    <AlfaApp />
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
