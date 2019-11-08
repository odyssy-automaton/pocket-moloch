import React from 'react';

import SymbolIcon from './SymbolIcon';

const ValueDisplay = (props) => {
  const { tokenSymbol, value } = props;

  const showSymbol = () => {
    return tokenSymbol !== 'WETH' && tokenSymbol !== 'DAI';
  };

  return (
    <>
      <SymbolIcon tokenSymbol={tokenSymbol} />
      {value}
      {showSymbol() ? tokenSymbol : null}
    </>
  );
};

export default ValueDisplay;
