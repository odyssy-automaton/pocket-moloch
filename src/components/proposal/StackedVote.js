import React, { useState, useEffect } from 'react';
import McDaoService from '../../utils/McDaoService';

const StackedVote = ({id, baseColor, noColor, yesColor, currentYesVote, currentNoVote}) => {

  const [noVoteShares, setNoVoteShares] = useState(0);
  const [yesVoteShares, setYesVoteShares] = useState(0);
  const [percentageSharesYes, setPercentageSharesYes] = useState(0);
  const [percentageSharesNo, setPercentageSharesNo] = useState(0);

  if(currentYesVote === undefined){
    currentYesVote = 0;
  }
  if(currentNoVote === undefined){
    currentNoVote = 0;
  }

  useEffect(() => {
    const currentProposal = async () => {
      const daoService = new McDaoService();
      const info = await daoService.proposalQueue(id);
      const noVoteShares = info.noVotes.toNumber() + currentNoVote;
      const yesVoteShares = info.yesVotes.toNumber() + currentYesVote;
      const totalVoteShares = noVoteShares + yesVoteShares;
      const percentageSharesYes = (yesVoteShares / totalVoteShares) * 100 || 0;
      const percentageSharesNo = (noVoteShares / totalVoteShares) * 100 || 0;

      setNoVoteShares(noVoteShares);
      setYesVoteShares(yesVoteShares);
      setPercentageSharesYes(percentageSharesYes);
      setPercentageSharesNo(percentageSharesNo);

    }
    currentProposal ()
  }, [id, currentYesVote, currentNoVote])

  // const noVotes = {
  //   textAlign: 'center',
  // };
  const fullBar = {
    width: '100%',
    height: '5px',
    position: 'relative',
  };
  const baseBar = {
    width: '100%',
    height: '5px',
    position: 'absolute',
    backgroundColor: baseColor || 'rgba(0,0,0,0.05)',
  };
  const noBar = {
    width: percentageSharesNo + '%',
    height: '5px',
    right: '0px',
    position: 'absolute',
    backgroundColor: noColor || 'rgba(239,73,123,1)',
    // backgroundColor: noColor || 'rgba(0,0,0,1)',
  };
  const yesBar = {
    width: percentageSharesYes + '%',
    height: '5px',
    position: 'absolute',
    backgroundColor: yesColor || 'rgba(203,46,206,1)',
  };
  const noLabel = {
    position: 'absolute',
    top: '-50px',
    left: '-62px',
    textAlign: 'center',
    backgroundColor: 'white',
    fontWeight: '900',
    width: '65px',
    color: noColor || 'rgba(239,73,123,1)',
  };
  const yesLabel = {
    position: 'absolute',
    top: '-50px',
    right: '-62px',
    textAlign: 'center',
    backgroundColor: 'white',
    fontWeight: '900',
    width: '65px',
    color: yesColor || 'rgba(203,46,206,1)',
  };
  const quorumBar = {
    width: '2px',
    height: '5px',
    position: 'absolute',
    top: '0px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    zIndex: '1',
  };

  return (
    <div className="FullBar" style={fullBar}>
      <div className="Labels">
        <span className="NoLabel" style={noLabel}>
          {noVoteShares}
        </span>
        <span className="YesLabel" style={yesLabel}>
          {yesVoteShares}
        </span>
      </div>
      <div className="BaseBar" style={baseBar} />
      <div className="NoBar" style={noBar} />
      <div className="YesBar" style={yesBar} />
      <div className="QuorumBar" style={quorumBar} />
    </div>
  );
};

export default StackedVote;
