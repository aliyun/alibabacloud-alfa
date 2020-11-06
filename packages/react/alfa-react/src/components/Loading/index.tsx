import React from 'react';
import Skeleton from './Skeleton';

export default function getLoading({loading}: {loading?: boolean | React.ReactChild}) {
  if (loading === false) {
    return null;
  } else if (loading && React.isValidElement(loading)) {
    return loading;
  }

  return <Skeleton active />;
}