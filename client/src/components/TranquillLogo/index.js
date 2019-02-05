import React from 'react';
import Large from './large';
import Small from './small';

const TranquillLogo = ({ size = 'sm' }) => {
  switch (size) {
    case 'lg':
      return <Large />;
    case 'sm':
      return <Small />;
    default:
      return <Small />;
  }
};

export default TranquillLogo;
