import React from 'react';

import useBidPackageListStore from './store';
import { tableBorderColor } from './config';

import Row from './Row';
import HeaderRow from './Row/HeaderRow';
import TableNoData from '../UI/TableNoData';
import Modals from './Modals';
import EventCore from './EventCore';
import ListViewRow from './ListViewRow';

type BidPackageListProps = {
  projectId?: any;
  projectProposalId?: any;
  viewType: string;
};

const { getRowId } = useBidPackageListStore.getState();

function BidPackageList(props: BidPackageListProps) {
  const { projectId, projectProposalId, viewType } = props;

  const mergedCostList = useBidPackageListStore((state) => state.mergedCostList);
  const resetRefreshKey = useBidPackageListStore((state) => state.resetRefreshKey);

  const renderCostList = React.useMemo(() => {
    return mergedCostList.map((row, index, arr) => {
      const rowId = getRowId(row);
      const isLastRowIndex = index === arr.length - 1;
      return <Row key={rowId} rowId={rowId} rowIndex={index} isLastRowIndex={isLastRowIndex} />;
    });
  }, [mergedCostList.length, resetRefreshKey]);

  const wrapBoxProps = {
    style: {
      display: 'inline-block',
      minWidth: '100%',
      borderStyle: 'solid',
      borderColor: tableBorderColor,
      borderWidth: '0px 1px 1px 1px',
    },
  };

  const renderNoData = mergedCostList?.length > 0 ? null : <TableNoData />;

  const renderCostGridViewList = (
    <div {...wrapBoxProps}>
      <HeaderRow />
      {renderCostList}
      {renderNoData}
    </div>
  );

  const renderCostListViewList = (
    <div {...wrapBoxProps}>
      <ListViewRow dataSource={mergedCostList} />
      {renderNoData}
    </div>
  );

  return (
    <>
      <EventCore projectId={projectId} projectProposalId={projectProposalId} />

      {viewType === 'List' ? renderCostListViewList : renderCostGridViewList}
      <Modals />
    </>
  );
}

export default BidPackageList;
