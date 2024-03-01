// Icon.js

import React from 'react';

const Icon = ({ name, svgPath, className }) => {
  return (
    <span className={`material-icons ${className || ''}`}>
      {svgPath ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={svgPath} />
        </svg>
      ) : (
        name
      )}
    </span>
  );
};

export default Icon;
