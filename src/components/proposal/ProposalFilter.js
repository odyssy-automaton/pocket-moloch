import React, { useState, useEffect } from 'react';

import ProposalList from './ProposalList';
import { groupByStatus } from '../../utils/ProposalHelper';

import './ProposalFilter.scss';

const ProposalFilter = ({ proposals }) => {
  const [groupedProposals, setGroupedProposals] = useState();
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [activeList, setActiveList] = useState();

  const handleSelect = (list, listName) => {
    setFilteredProposals(list);
    setActiveList(listName);
  };

  useEffect(() => {
    const groupedProps = groupByStatus(proposals);

    setGroupedProposals(groupByStatus(proposals));
    setFilteredProposals(groupedProps.VotingPeriod);
    setActiveList('VotingPeriod');
  }, [proposals]);

  if (!groupedProposals) {
    return <></>;
  }

  return (
    <div className="ProposalFilter">
      <div className="ProposalFilter__Filters">
        <button
          onClick={() =>
            handleSelect(groupedProposals.VotingPeriod, 'VotingPeriod')
          }
          className={activeList === 'VotingPeriod' ? 'Active' : null}
        >
          Voting Period ({groupedProposals.VotingPeriod.length})
        </button>
        <button
          onClick={() =>
            handleSelect(groupedProposals.GracePeriod, 'GracePeriod')
          }
          className={activeList === 'GracePeriod' ? 'Active' : null}
        >
          Grace Period ({groupedProposals.GracePeriod.length})
        </button>
        <button
          onClick={() =>
            handleSelect(
              groupedProposals.ReadyForProcessing,
              'ReadyForProcessing',
            )
          }
          className={activeList === 'ReadyForProcessing' ? 'Active' : null}
        >
          Ready For Processing ({groupedProposals.ReadyForProcessing.length})
        </button>
        <button
          onClick={() => handleSelect(groupedProposals.Completed, 'Completed')}
          className={activeList === 'Completed' ? 'Active' : null}
        >
          Completed ({groupedProposals.Completed.length})
        </button>
        <button
          onClick={() => handleSelect(groupedProposals.InQueue, 'InQueue')}
          className={activeList === 'InQueue' ? 'Active' : null}
        >
          In Queue ({groupedProposals.InQueue.length})
        </button>
        {}
      </div>
      <ProposalList proposals={filteredProposals} />
    </div>
  );
};

export default ProposalFilter;
