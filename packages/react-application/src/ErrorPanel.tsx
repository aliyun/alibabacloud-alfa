import React from 'react';

interface IProps {
  error: Error;
}
const padding = 24;
const containerBackground = '#fcebea';

const containerStyle = {
  background: containerBackground,
  padding,
}

const commonErrorStyle = {
  lineHeight: '22px',
  color: '#d93026',
  fontSize: 14
}

const ErrorPanel: React.SFC<IProps> = (props: { error: Error }) => {
  const { error } = props;
  return (
    <div style={{padding}}>
      { 
        process.env.NODE_ENV === 'development'
          ? (
            <div style={containerStyle}>
              <div style={commonErrorStyle}>{error.message}</div>
              <pre style={{overflow: 'scroll'}}>{error.stack}</pre>
            </div>
          )
          : <div style={commonErrorStyle}>Error</div>
      }
    </div>
  );
}

export default ErrorPanel;