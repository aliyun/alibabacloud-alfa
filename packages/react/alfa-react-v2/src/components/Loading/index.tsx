import React from 'react';
import Skeleton from './Skeleton';

export default function getLoading({ loading }: {loading?: boolean | React.ReactChild}) {
  if (loading === false) {
    return null;
  }

  return loading && React.isValidElement(loading) ? loading : <Skeleton active />;
}
