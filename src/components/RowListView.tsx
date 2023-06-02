import React, { useState, useCallback, useMemo } from 'react';
import './index.less';
import useBidPackageListStore from '../store';
import RowCollapse from './RowCollapse';
import { Box, IconButton, Tooltip, TextField } from '@mui/material';
import IconFont from '@/components/IconFont';
import { ErrorOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Link } from 'umi';
import type { CostListItem, CustomizedCostListItem } from '../types';
import useRowStore, { RowStoreProvider, RowStoreUpdater } from '../RowStore';
import useWorkShopStore from '../../../useWorkShopStore';
import BasicPopover from '@/components/BasicPopover/BasicPopover';
import { NumberFormatCustom } from '@/components/AmountFormat';
import DeletePopover from '@/pages/PunchDetail/components/deletePopover';
import message from '@/components/SnackbarUtils';
const { getRowId } = useBidPackageListStore.getState();
const { Event: BidPackageListEvent, setCollapsedRowIds } = useBidPackageListStore.getState();

const formatNumber = (val: any) =>
  Number(val).toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });

function Row(props: {
  expandedRowType: any;
  handleRowClick: any;
  expandedRow: any;
  row: any;
  rowId: any;
}) {
  const {
    expandedRowType,
    handleRowClick,
    expandedRow,
    // row,
    rowId,
  } = props;

  const readOnly = useWorkShopStore((state) => state.readOnly);
  const setRow: any = useRowStore((state) => state.setRow);
  const projectProposalId = useBidPackageListStore((state) => state.projectProposalId);
  const proposalDetail = useWorkShopStore((state) => state.proposalDetail);
  const setFinalBid = useRowStore((state) => state.setFinalBid);
  const setCoveredByUser = useRowStore((state) => state.setCoveredByUser);
  const row: any = useRowStore((state) => state.row);
  const popoverRef: any = React.useRef();
  const inputRef = React.useRef(null);

  const {
    projectId,
    bidId,
    bidCode,
    bidTitle,
    csiCode,
    csiName,
    finalBid,
    duplicateProjectProposalList,
    isServiceFrom,
    task,
    convertToBidEnable,
    subtotal,
  } = row || {};

  const [isEditAmount, setIsEditAmount] = React.useState(false);
  const [finalBidAmount, setFinalBidAmount] = React.useState(finalBid);

  React.useEffect(() => {
    if (isEditAmount) {
      inputRef?.current?.focus?.();
    }
  }, [isEditAmount]);

  const showBidLink = !!projectId && !!bidId;
  const bidLinkTo = `/project/${projectId}/bid/${bidId}`;
  const taskLinkTo = `/project/${proposalDetail?.projectInfo?.projectId}/task/${task?.taskId}`;

  const showCompareButton = !!projectId && !!bidId;

  const errorMsg = React.useMemo(() => {
    if (!duplicateProjectProposalList?.length) return;
    const duplicateProjectProposalListFiltered = duplicateProjectProposalList?.filter(
      (item: any) => item.projectProposalId !== projectProposalId,
    );
    if (!duplicateProjectProposalListFiltered?.length) return;
    const isDuplicateAnyoneNotDraft = duplicateProjectProposalListFiltered?.some(
      (item: any) => item.status != 3,
    );
    const errorMsgGeneratedDraftName = duplicateProjectProposalListFiltered?.filter(
      (item: any) => item.status == 3,
    )[0]?.name;
    const errorMsgGeneratedNotDraftName = duplicateProjectProposalListFiltered?.filter(
      (item: any) => item.status != 3,
    )[0]?.name;
    const errorMsgGeneratedNotDraftStatusName = duplicateProjectProposalListFiltered?.filter(
      (item: any) => item.status != 3,
    )[0]?.statusName;
    const errorMsgMap = {
      1: `It shows the bid package has been generated to Proposal [${errorMsgGeneratedNotDraftName}, ${errorMsgGeneratedNotDraftStatusName}].The Proposal has been submitted to the Owner, you need to remove this bid package before generating a new proposal.`,

      2: `It shows the bid package has been generated to Proposal [${errorMsgGeneratedDraftName}, Draft].You can generate a new proposal but can only submit one of them to Owner.`,
    };
    return isDuplicateAnyoneNotDraft ? errorMsgMap[1] : errorMsgMap[2];
  }, [projectProposalId, duplicateProjectProposalList]);

  const typeAmount = React.useMemo(() => {
    const { groupList = [] } = row;
    const itemFilterList: any[] = [];
    groupList.map((groupListRow: { itemList?: never[] | undefined }) => {
      const { itemList = [] } = groupListRow;
      itemList.map((itemRow) => {
        itemFilterList.push(itemRow);
      });
    });
    const LaborList = itemFilterList?.filter((i) => i?.typeInfo?.name === 'Labor') || [];
    const LaborAmount = LaborList?.reduce((sum, e) => sum + Number(e?.amount || 0), 0);

    const MaterialList = itemFilterList?.filter((i) => i?.typeInfo?.name === 'Material') || [];
    const MaterialAmount = MaterialList?.reduce((sum, e) => sum + Number(e?.amount || 0), 0);

    const OtherList =
      itemFilterList?.filter(
        (i) => i?.typeInfo?.name !== 'Material' && i?.typeInfo?.name !== 'Labor',
      ) || [];
    const OtherAmount = OtherList?.reduce((sum, e) => sum + Number(e?.amount || 0), 0);

    return {
      LaborAmount,
      MaterialAmount,
      OtherAmount,
    };
  }, [row]);

  const onDelete = (event: any) => {
    BidPackageListEvent?.emit('onDeleteRow', { rowId, row, event, setRow });
  };

  const onCompareClick = (event: any) => {
    BidPackageListEvent?.emit('onRowCompareClick', { rowId, row, event, setRow });
  };

  const onCreateBidPackageClick = (event: any) => {
    BidPackageListEvent?.emit('onRowCreateBidPackageClick', { rowId, row, event, setRow });
  };

  const renderDeleteIconButton = readOnly ? null : (
    <IconButton onClick={onDelete} size="small">
      <RemoveCircleOutline style={{ color: '#09849F', cursor: 'pointer', fontSize: '16px' }} />
    </IconButton>
  );

  const renderTaskDeleteIconButton = readOnly ? null : (
    <>
      {task?.deletable ? (
        <DeletePopover
          DeleteView={(props) => (
            <IconButton
              aria-label="delete"
              size="small"
              sx={{
                color: '#09849F',
                cursor: 'pointer',
              }}
              {...props}
            >
              <RemoveCircleOutline style={{ cursor: 'pointer', fontSize: '16px' }} />
            </IconButton>
          )}
          handleRemove={onDelete}
          msg="The task converted by this service would be deleted if you remove this service. Are you sure to remove it?"
        />
      ) : (
        <Tooltip
          arrow
          title="Unable to remove the service since the task converted by this service has been scheduled."
          placement="top-start"
        >
          <IconButton size="small">
            <RemoveCircleOutline style={{ cursor: 'pointer', fontSize: '16px' }} />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  const renderCreateBidPackageButton = convertToBidEnable ? (
    <BasicPopover
      okText="Create"
      onOk={onCreateBidPackageClick}
      onLoading={false}
      ref={popoverRef}
      buttonAction={
        <IconButton size="small" onClick={() => popoverRef.current?.subscribe(event)}>
          <IconFont type="detail" size={16} color="#09849F" />
        </IconButton>
      }
    >
      No Bid Package for this service, Create one new.
    </BasicPopover>
  ) : null;

  const renderTaskButton = !task?.taskId ? null : (
    <Tooltip arrow title={'Task Detail'} placement="top-start">
      <Link to={taskLinkTo} target="_blank">
        <IconButton size="small">
          <IconFont type="task-32px" size={16} color="#09849F" />
        </IconButton>
      </Link>
    </Tooltip>
  );

  const renderLinkButton = !showBidLink ? null : (
    <Tooltip arrow title={'Bid Package Detail'} placement="top-start">
      <Link to={bidLinkTo} target="_blank">
        <IconButton size="small">
          <IconFont type="detail" size={16} color="#09849F" />
        </IconButton>
      </Link>
    </Tooltip>
  );

  const renderCompareButton = !showCompareButton ? null : (
    <Tooltip arrow title={'Summary Comparison'} placement="top-start">
      <IconButton onClick={onCompareClick} size="small">
        <IconFont type="compare" size={16} color="#09849F" />
      </IconButton>
    </Tooltip>
  );
  const renderErrorInfoTooltip =
    errorMsg === undefined || errorMsg === null ? null : (
      <Tooltip arrow title={errorMsg ?? false} placement="top-end">
        <ErrorOutline style={{ color: '#F79921', fontSize: '16px' }} />
      </Tooltip>
    );

  const renderFinalBidAmount = (
    <React.Fragment>
      <div>
        {isEditAmount ? (
          <>
            <TextField
              size="small"
              // disabled={disabled}
              placeholder="$ 0.00"
              value={finalBidAmount}
              inputRef={inputRef}
              name="numberformat"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { borderWidth: '0px !important' },
                '& .MuiInputBase-input': { fontSize: '12px !important', paddingLeft: '0px' },
              }}
              onChange={(v) => {
                const { value } = v?.target;
                setFinalBidAmount(value ? Number(value) : 0.0);
              }}
              onBlur={() => {
                setFinalBid(finalBidAmount);
                setIsEditAmount(false);
                setCoveredByUser(true);
              }}
              id="formatted-numberformat-input"
              InputProps={{
                style: { height: '33px' },
                inputComponent: NumberFormatCustom as any,
              }}
            />
          </>
        ) : (
          <Box sx={{ color: '#000', fontWeight: 'bold', textAlign: 'right', fontSize: '12px' }}>
            {formatNumber(finalBid)}
          </Box>
        )}
      </div>

      <div>
        {!readOnly && (
          <Tooltip
            arrow
            title="Lump sum amount can be input only when there is no cost."
            placement="top-end"
          >
            <Box
              sx={{ cursor: 'pointer', ml: '5px', mr: '5px' }}
              onClick={() => {
                console.log({ subtotal });
                if (subtotal && Number(subtotal) > 0) {
                  return;
                }
                setFinalBidAmount(finalBid ? Number(finalBid) : 0);
                setIsEditAmount(true);
              }}
            >
              <IconFont
                type="a-drawing_adddrawing"
                size={16}
                color={subtotal && Number(subtotal) > 0 ? '#7f8384' : '#09849F'}
              />
            </Box>
          </Tooltip>
        )}
      </div>
    </React.Fragment>
  );

  const renderRow = useCallback(
    (rowData, rowIndex) => {
      return (
        <React.Fragment key={rowId}>
          <div
            className="costTable-row Cell-row"
            style={{
              gridTemplateColumns: expandedRowType
                ? `20% 12% 5% repeat(9, 1fr)`
                : `20% 12% 5% repeat(5, 1fr)`,
            }}
          >
            <div className="costTable-cell" style={{ paddingLeft: '5px', borderLeft: 'none' }}>
              {!row?.task ? renderDeleteIconButton : renderTaskDeleteIconButton}
              <IconFont
                onClick={() => handleRowClick(rowId)}
                color="#09849F"
                size={16}
                type="a-foldless"
                style={{
                  transform: `rotate(${expandedRow === rowId ? 0 : 180}deg)`,
                  transition: 'all 0.22s',
                  cursor: 'pointer',
                  minWidth: '16px',
                }}
              />

              <span style={{ marginRight: '5px', marginLeft: '5px' }}>{rowData.csiCode}</span>
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {rowData.csiName}
              </span>
              <span style={{ marginRight: '5px' }} />
              {renderErrorInfoTooltip}
              {renderLinkButton}
              {renderTaskButton}
              {renderCreateBidPackageButton}
              {renderCompareButton}
            </div>
            <div className="costTable-cell" />
            <div className="costTable-cell" />
            <div className="costTable-cell">
              {formatNumber(rowData?.proposedBidProposal?.grandTotal || 0)}
            </div>
            {expandedRowType && renderBlankRow(4)}
            <div className="costTable-cell"> {formatNumber(typeAmount.LaborAmount || 0)}</div>
            <div className="costTable-cell"> {formatNumber(typeAmount.MaterialAmount || 0)}</div>
            <div className="costTable-cell">{formatNumber(typeAmount.OtherAmount || 0)}</div>
            <div className="costTable-cell" style={{ justifyContent: 'space-between' }}>
              {renderFinalBidAmount}
            </div>
          </div>
          {expandedRow === rowId && (
            <RowCollapse
              key={rowId}
              rowData={rowData}
              groupList={rowData?.groupList || []}
              expandedRowType={expandedRowType}
            />
          )}
        </React.Fragment>
      );
    },
    [
      rowId,
      expandedRowType,
      row?.task?.deletable,
      expandedRow,
      typeAmount.LaborAmount,
      typeAmount.MaterialAmount,
      typeAmount.OtherAmount,
      renderFinalBidAmount,
      handleRowClick,
    ],
  );

  return <React.Fragment>{renderRow(row, rowId)}</React.Fragment>;
}

const renderBlankItemRow = (array: any[]) => (
  <React.Fragment>
    {array.map((arrayItem) => (
      <div className="costTable-cell" key={arrayItem} style={{ backgroundColor: '#f0f0f0' }}>
        {arrayItem}
      </div>
    ))}
  </React.Fragment>
);

const renderBlankRow = (rowNumber = 0) => (
  <React.Fragment>
    {Array.from({ length: rowNumber }).map((_, index) => (
      <div className="costTable-cell" key={index} />
    ))}
  </React.Fragment>
);

const Table = (props: { dataSource: any }) => {
  const { dataSource } = props;

  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedRowType, setExpandedRowType] = useState<any>(false);

  BidPackageListEvent?.on('onValidate', (errors: any) => {
    if (errors) {
      message.warning('Please select bidder/bid for all bid packages in the cost grid view.');
    }
  });

  const handleRowClick = useCallback(
    (rowIndex) => {
      setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
    },
    [expandedRow],
  );

  return (
    <div className="costTable">
      <div
        className="costTable-row costTable-header"
        style={{
          gridTemplateColumns: expandedRowType
            ? `20% 12% 5% repeat(9, 1fr)`
            : `20% 12% 5% repeat(5, 1fr)`,
        }}
      >
        <div className="costTable-cell" style={{ borderLeft: 'none' }}>
          Service
        </div>
        <div className="costTable-cell">Description</div>
        <div className="costTable-cell">Tax</div>
        <div className="costTable-cell">Proposed Bid ($)</div>
        {expandedRowType && renderBlankItemRow(['Type', 'Unit', 'Unit Type', ' Rate($)'])}
        <div className="costTable-cell" style={{ paddingLeft: '0px' }}>
          <IconFont
            type="back_24dp-01"
            size={22}
            style={{
              cursor: 'pointer',
              transform: `rotate(${expandedRowType ? 360 : 180}deg)`,
              transition: 'all 0.3s',
              userSelect: 'none',
              color: '#09849F',
              backgroundColor: '#f5f7f9',
            }}
            onClick={() => {
              setExpandedRowType(!expandedRowType);
            }}
          />
          Labor ($)
        </div>
        <div className="costTable-cell">Material ($)</div>
        <div className="costTable-cell">Other ($)</div>
        <div className="costTable-cell">Final Bid ($)</div>
      </div>
      {dataSource.map((row: CostListItem & CustomizedCostListItem, index: number) => {
        const rowId = getRowId(row);
        return (
          <RowStoreProvider key={rowId}>
            <Row
              row={row}
              rowId={rowId}
              expandedRowType={expandedRowType}
              handleRowClick={() => {
                handleRowClick(rowId);
              }}
              expandedRow={expandedRow}
            />
            <RowStoreUpdater rowId={rowId} rowIndex={index} />
          </RowStoreProvider>
        );
      })}
    </div>
  );
};

export default React.memo(Table);
