import React from 'react';
import { BrowserRouter, BrowserRouterProps, useHistory } from 'react-router-dom';

import { useSyncHistory } from './utils';

function Routes(props: BrowserRouterProps) {
  const history = useHistory();
  const { isFirstEnter, needSync, renderFromParent } = useSyncHistory(history);

  if (isFirstEnter && needSync && renderFromParent) return null;

  return (
    <>
      {props.children}
    </>
  );
}

export default function AlfaBrowserRouter(props: BrowserRouterProps) {
  const { children, ...restProps } = props;

  return (
    <BrowserRouter>
      <Routes {...restProps}>
        {children}
      </Routes>
    </BrowserRouter>
  );
}
