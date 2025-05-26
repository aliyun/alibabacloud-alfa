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
  manifest: 'https://dev.g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json',
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
