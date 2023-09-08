import React, { useContext, useRef } from 'react';

import { Context } from './Context';

interface IProps {
  target: '_blank' | '_parent';
  href: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const stripExtraSlash = (path?: string) => {
  return path ? path.replace(/^(\/+)(?=[^/])/, '/') : '';
};

const getHref = (origin?: string, basename?: string, path?: string) => {
  if (['http', '//'].find((str) => path.startsWith(str))) return path;

  return `${origin}${stripExtraSlash(basename)}${stripExtraSlash(path)}`;
};

export const AlfaAnchor = (props: IProps) => {
  const { target, children, href, className, style } = props;
  const el = useRef(null);
  const { appProps } = useContext(Context);
  const { basename } = appProps;

  return target === '_parent' ? (
    <a
      ref={el}
      data-alfa-external-router
      href={getHref('', '', href)}
      onClick={(e) => {
        // 非 a 标签不会被外部的事件委托捕获，需要伪造一次 a 标签点击
        if ((e.target as HTMLAnchorElement).tagName !== 'A') {
          el.current?.dispatchEvent(new Event('click'));
        }

        e.preventDefault();
        e.stopPropagation();
      }}
      className={className}
      style={style}
    >
      {children}
    </a>
  ) : (
    // blank
    <a
      href={getHref(location.origin, basename, href)}
      target="_blank"
      rel="noreferrer"
      className={className}
      style={style}
    >
      {children}
    </a>
  );
};
