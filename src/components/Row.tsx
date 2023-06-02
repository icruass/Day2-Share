import React from 'react';

import useBidPackageListStore from '../store';
import useRowStore, { RowStoreProvider, RowStoreUpdater } from '../RowStore';

import { defaultColumnsObj, tableBorderColor } from '../config';

import RowCollapse from './RowCollapse';

import ColumnService from './ColumnService';
import ColumnFloor from './ColumnFloor';
import ColumnFinalBid from './ColumnFinalBid';
import ColumnEstimation from './ColumnEstimation';
import ColumnProposedBid from './ColumnProposedBid';
import ColumnBidderItem from './ColumnBidderItem';
import ColumnHistoryCostItem from './ColumnHistoryCostItem';
import ColumnAddHistoryCostItem from './ColumnAddHistoryCostItem';
import TableRowUI from '../../UI/TableRow';
import TableCellUI from '../../UI/TableCell';

function Row(props: RowProps) {
  const { isLastRowIndex, rowIndex, rowId } = props;

  const row = useRowStore((state) => state.row);
  const setHistoryProjectProposalCustomizedCostList = useRowStore(
    (state) => state.setHistoryProjectProposalCustomizedCostList,
  );

  const bidProposalList = row?.bidProposalList || [];
  const historyProjectProposalCustomizedCostList =
    row?.historyProjectProposalCustomizedCostList || [];

  const collapsedRowIds = useBidPackageListStore((state) => state.collapsedRowIds);
  const rowCollapseOpen = collapsedRowIds.includes(rowId);

  const rowStyle = {
    borderStyle: 'solid',
    borderWidth: `0px 0px ${rowCollapseOpen || isLastRowIndex ? 0 : 1}px 0px`,
    borderColor: rowCollapseOpen ? 'transparent' : tableBorderColor,
  };

  const renderBidderColumns = bidProposalList.map((bidProposal, index, arr) => {
    const cellProps = {
      width: 200,
    };
    return (
      <TableCellUI key={bidProposal.bidProposalId} {...cellProps}>
        <ColumnBidderItem
          bidProposal={bidProposal}
          bidProposalIndex={index}
          bidProposalList={arr}
        />
      </TableCellUI>
    );
  });

  const isRenderHistoryColumns =
    !!row?.projectProposalCustomizedCostId || !!(row as any)?.isServiceFrom;

  const renderHistoryProjectProposalCustomizedCostListColumns = !isRenderHistoryColumns
    ? null
    : [...historyProjectProposalCustomizedCostList, ''].map((historyCostItem, index, arr) => {
        const cellProps = {
          width: 200,
        };
        if (historyCostItem === '')
          return (
            <TableCellUI {...cellProps}>
              <ColumnAddHistoryCostItem />
            </TableCellUI>
          );

        const { projectProposalCustomizedCostId } = historyCostItem as any;

        return (
          <TableCellUI key={projectProposalCustomizedCostId} {...cellProps}>
            <ColumnHistoryCostItem
              historyCostItem={historyCostItem}
              historyCostItemIndex={index}
              historyCostItemList={arr}
              row={row}
              setHistoryProjectProposalCustomizedCostList={
                setHistoryProjectProposalCustomizedCostList
              }
            />
          </TableCellUI>
        );
      });

  const renderRow = (
    <TableRowUI style={rowStyle} collapse={rowCollapseOpen} renderCollapse={<RowCollapse />}>
      <TableCellUI {...defaultColumnsObj.service} borderRight>
        <ColumnService />
      </TableCellUI>

      <TableCellUI {...defaultColumnsObj.floor} borderRight>
        <ColumnFloor />
      </TableCellUI>

      <TableCellUI {...defaultColumnsObj.finalBid} borderRight>
        <ColumnFinalBid />
      </TableCellUI>

      <TableCellUI {...defaultColumnsObj.originalEstimation} borderRight>
        <ColumnEstimation />
      </TableCellUI>

      <TableCellUI {...defaultColumnsObj.proposedBidder} borderRight>
        <ColumnProposedBid />
      </TableCellUI>

      {renderBidderColumns}
      {renderHistoryProjectProposalCustomizedCostListColumns}
    </TableRowUI>
  );

  return renderRow;
}

export type RowProps = {
  rowId: any;
  rowIndex: number;
  isLastRowIndex: boolean;
};

function RowWithStore(props: RowProps) {
  return (
    <RowStoreProvider>
      <Row {...props} />
      <RowStoreUpdater {...props} />
    </RowStoreProvider>
  );
}

export default RowWithStore;
