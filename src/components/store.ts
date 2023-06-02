import type { UseBoundStore, StoreApi } from 'zustand';
import type { CostListItem, CustomizedCostListItem, MergedCostListItem } from './types';

import { create } from 'zustand';
import EventEmitter from '@/utils/EventEmitter';
import { getFetchFn } from '@/hooks/useRequest';

const apiGetFloorListFn = getFetchFn(`/api/pms/bid/project/building/floor/list`, { method: 'GET' });

export const initState = {
  projectProposalId: '',
  projectId: '',
  costList: [],
  floorList: [],
  customizedCostList: [],
  mergedCostList: [],
  quickEnterModalParams: {},
  addHistoryModalParams: {},
  bidCompareModalParams: {},
  bidCreateBidPackageParams: {},
  hasDuplicate: false,
  finalBidTotal: 0,
  costTaxableTotal: 0,
  grandTotal: 0,
  validateErrors: undefined,
  collapsedRowIds: [],
};

export const getStoreState = (set: any, get: any): State => {
  const Event = new EventEmitter();

  return {
    ...initState,
    Event,
    resetRefreshKey: 1,
    apiGetFloorList: async (params: any) => {
      const { setFloorList } = get();
      const res = await apiGetFloorListFn(params);
      if (res?.code === 0) {
        const dataList = res?.data || [];
        setFloorList(dataList);
      }
    },

    setCollapsedRowIds: (v: any) => set({ collapsedRowIds: v }),
    setFloorList: (v: any) => set({ floorList: v }),
    setCostList: (v: any) => set({ costList: v }),
    setCustomizedCostList: (v: any) => set({ customizedCostList: v }),
    setMergedCostList: (v: any) => set({ mergedCostList: v }),

    setGrandTotal: (v: any) => set({ grandTotal: v }),
    setProjectId: (v: any) => set({ projectId: v }),
    setProjectProposalId: (v: any) => set({ projectProposalId: v }),
    setQuickEnterModalParams: (v: any) => set({ quickEnterModalParams: v }),
    setAddHistoryModalParams: (v: any) => set({ addHistoryModalParams: v }),
    setCreateBidPackageModalParams: (v: any) => set({ bidCreateBidPackageParams: v }),
    setFinalBidTotal: (v: any) => set({ finalBidTotal: v }),
    setFinalBidTotalCalculate: () => {
      const { setFinalBidTotal, costList, customizedCostList } = get();
      const newTotal = calculateFinalBidTotal(costList, customizedCostList);
      setFinalBidTotal(newTotal);
      return newTotal;
    },

    setCostTaxableTotal: (v: any) => set({ costTaxableTotal: v }),
    setCostTaxableTotalCalculate: () => {
      const { setCostTaxableTotal, costList, customizedCostList } = get();
      const newTotal = calculateCostTaxableTotal(costList, customizedCostList);
      setCostTaxableTotal(newTotal);
      return newTotal;
    },

    getCostItemIsDuplicate: (costItem: any) => {
      const { projectProposalId } = get();
      const duplicateList = costItem.duplicateProjectProposalList || [];
      const duplicateListFiltered = duplicateList.filter(
        (item: any) => item.projectProposalId !== projectProposalId,
      );
      return duplicateListFiltered.some((item: any) => item.status != 3);
    },

    selectorHasDuplicate: () => {
      const { costList, projectProposalId } = get();

      const hasDuplicate = costList.some((item: any) => {
        const duplicateList = item.duplicateProjectProposalList || [];
        const duplicateListFiltered = duplicateList.filter(
          (item: any) => item.projectProposalId !== projectProposalId,
        );
        return duplicateListFiltered.some((item: any) => item.status != 3);
      });
      return hasDuplicate;
    },

    getRowBidProposalItem: (rowId: any, bidProposalId: any) => {
      const { costList, getRowId } = get() as State;
      const row = costList.filter((item: any) => getRowId(item) === rowId)[0];
      const bidProposalList = row?.bidProposalList || [];
      const bidProposalItem: any = bidProposalList.filter(
        (item: any) => item.bidProposalId === bidProposalId,
      )[0];
      return bidProposalItem || {};
    },

    setRowBidProposalItem: (rowId: any, bidProposalId: any, newValue: any) => {
      const { costList, getRowId } = get();
      const newCostList = costList.map((row: any) => {
        const isToSetRow = getRowId(row) === rowId;
        if (!isToSetRow) return row;
        const bidProposalList = row.bidProposalList || [];
        const newBidProposalList = bidProposalList.map((item: any) => {
          if (item.bidProposalId === bidProposalId) {
            return { ...item, ...newValue };
          }
          return item;
        });
        const newRow = { ...row, bidProposalList: newBidProposalList };
        return newRow;
      });
      set({ costList: newCostList });
    },

    // actions
    // action: reset cost list by fetch proposal detail
    resetCostListOnFetch: (fetchCostList: any) => {
      if (!Array.isArray(fetchCostList)) return get();
      const newCostList = fetchCostList.map((item) => {
        return { ...item, ganttId: item.bidId };
      });
      const { customizedCostList, resetRefreshKey } = get();
      const newMergedCostList = newCostList.concat(customizedCostList);
      set({ costList: newCostList, mergedCostList: newMergedCostList });
      set({ resetRefreshKey: resetRefreshKey + 1 });
      const { selectorHasDuplicate } = get();
      const hasDuplicate = selectorHasDuplicate();
      set({ hasDuplicate });
      return get();
    },

    // action: add cost list by confirm add bid package button
    addCostListOnAddBibPackage: (addedBidPackageList: any) => {
      if (!Array.isArray(addedBidPackageList)) return get();
      const { costList, customizedCostList } = get();
      const newCostList = addedBidPackageList
        .map((item: any) => {
          const costListExistItem = costList.filter((cost: any) => cost.bidId === item.bidId)[0];
          if (!!costListExistItem) return costListExistItem;
          return item;
        })
        .map((item: any) => {
          return { ...item, ganttId: item.bidId };
        });
      const newMergedCostList = newCostList.concat(customizedCostList);
      set({ costList: newCostList, mergedCostList: newMergedCostList });
      const { selectorHasDuplicate } = get();
      const hasDuplicate = selectorHasDuplicate();
      set({ hasDuplicate });
      return get();
    },

    // action: reset customizedCostList by fetch proposal detail
    resetCustomizedCostListOnFetch: (fetchCustomizedCostList: any) => {
      if (!Array.isArray(fetchCustomizedCostList)) return get();
      const newCustomizedCostList = fetchCustomizedCostList.map((item, index) => {
        return {
          ...item,
          isServiceFrom: true,
          frontedId: `${new Date().getTime()}${index}`,
          ganttId: `${new Date().getTime()}${index}`,
        };
      });
      const { costList, resetRefreshKey } = get();
      const newMergedCostList = costList.concat(newCustomizedCostList);
      set({ customizedCostList: newCustomizedCostList, mergedCostList: newMergedCostList });
      set({ resetRefreshKey: resetRefreshKey + 1 });
      return get();
    },

    // action: add customizedCostList by confirm add service button
    addCustomizedCostListOnAddService: (addedCsiObj: any) => {
      if (!addedCsiObj) return get();
      const { costList, customizedCostList } = get();
      const addedCsiObjHandler = {
        ...addedCsiObj,
        frontedId: new Date().getTime(),
        ganttId: new Date().getTime(),
        isServiceFrom: true,
      };
      const newCustomizedCostList = customizedCostList.concat([addedCsiObjHandler]);
      const newMergedCostList = costList.concat(newCustomizedCostList);
      set({ customizedCostList: newCustomizedCostList, mergedCostList: newMergedCostList });
      return get();
    },

    // action: delete costList Item by row delete button
    deleteCostListItem: (deleteItem: any) => {
      if (!deleteItem) return get();
      const { getRowId, costList, customizedCostList } = get();
      const { isServiceFrom, projectProposalCostId } = deleteItem;
      if (isServiceFrom && !projectProposalCostId) return get();
      const deleteRowId = getRowId(deleteItem);
      const newCostList = costList.filter((item: any) => getRowId(item) !== deleteRowId);
      const newMergedCostList = newCostList.concat(customizedCostList);
      set({ costList: newCostList, mergedCostList: newMergedCostList });
      const { selectorHasDuplicate, setFinalBidTotalCalculate } = get();
      const hasDuplicate = selectorHasDuplicate();
      set({ hasDuplicate });
      setFinalBidTotalCalculate();
      return get();
    },

    // action: delete customizedCostList Item by row delete button
    deleteCustomizedCostListItem: (deleteItem: any) => {
      if (!deleteItem) return get();

      const { getRowId, costList, customizedCostList } = get();
      const { isServiceFrom, projectProposalCustomizedCostId } = deleteItem;
      if (!isServiceFrom && !projectProposalCustomizedCostId) return get();

      const deleteRowId = getRowId(deleteItem);

      const newCustomizedCostList = customizedCostList.filter(
        (item: any) => getRowId(item) !== deleteRowId,
      );
      const newMergedCostList = costList.concat(newCustomizedCostList);
      set({ customizedCostList: newCustomizedCostList, mergedCostList: newMergedCostList });
      const { setFinalBidTotalCalculate } = get();
      setFinalBidTotalCalculate();
      return get();
    },

    // action: update costList item
    updateCostListItem: (updateItem: any) => {
      const state = get();
      if (!updateItem) return state;
      const { isServiceFrom, projectProposalCostId, bidId } = updateItem;
      if (isServiceFrom && !(projectProposalCostId || bidId)) return state;

      const { costList, getRowId } = state;
      const newCostList = costList.map((costItem: any) => {
        if (getRowId(updateItem) === getRowId(costItem)) {
          return { ...costItem, ...updateItem };
        }
        return costItem;
      });
      set({ costList: newCostList });
      return get();
    },

    // action: add cost list by create a new bid package
    addCostListOnCreateBibPackage: (newCreatedBidPackage: any) => {
      if (!newCreatedBidPackage) return get();
      const { costList, customizedCostList } = get();
      const newCostList = [...costList, newCreatedBidPackage];
      const newMergedCostList = newCostList.concat(customizedCostList);
      set({ costList: newCostList, mergedCostList: newMergedCostList });
      return get();
    },

    // action: update CustomizedCostList  item
    updateCustomizedCostListItem: (updateItem: any) => {
      const state = get();
      if (!updateItem) return state;

      const { isServiceFrom, projectProposalCustomizedCostId } = updateItem;
      if (!isServiceFrom && !projectProposalCustomizedCostId) return state;

      const { customizedCostList, getRowId } = state;
      const newCustomizedCostList = customizedCostList.map((customizedItem: any) => {
        if (getRowId(updateItem) === getRowId(customizedItem)) {
          return { ...customizedItem, ...updateItem };
        }
        return customizedItem;
      });
      set({ customizedCostList: newCustomizedCostList });
      return get();
    },

    updateMergedCostListItem: (updateItem: any) => {
      const state = get();
      if (!updateItem) return state;

      const { mergedCostList, getRowId } = state;
      const newMergedCostList = mergedCostList.map((mergeItem: any) => {
        if (getRowId(updateItem) === getRowId(mergeItem)) {
          return { ...mergeItem, ...updateItem };
        }
        return mergeItem;
      });
      set({ mergedCostList: newMergedCostList });
      return get();
    },

    setValidateErrors: (v: any) => set({ validateErrors: v }),

    validate: () => {
      const state = get();
      const { costList, validateErrors, setValidateErrors } = state;
      const errors = validateErrors || {};

      const notProposedCostItems = costList.filter((costItem: any) => {
        return (
          costItem.bidProposalList?.length > 0 &&
          (!costItem.proposedBidProposal || !costItem.proposedBidProposal?.bidId)
        );
      });
      if (notProposedCostItems.length) {
        errors.notProposed = notProposedCostItems;
      } else {
        delete errors.notProposed;
      }

      const errorsResult = Object.keys(errors).length > 0 ? errors : undefined;

      setValidateErrors(errorsResult);
      Event.emit('onValidate', errorsResult);
      return errorsResult;
    },

    getRowId: (row) => {
      const { resetRefreshKey } = get();
      return `${
        row.projectProposalCostId ||
        row.projectProposalCustomizedCostId ||
        row.bidId ||
        (row as any).frontedId
      }_${resetRefreshKey}`;
    },

    getRow: (rowId: any) => {
      const state = get();
      const { mergedCostList } = state;
      const row = mergedCostList.filter((item: any) => state.getRowId(item) === rowId)[0];
      return row;
    },

    deleteRowById: (deleteRowId) => {
      const state = get();
      const { mergedCostList, costList, customizedCostList } = state;
      const newMergedCostList = mergedCostList.filter(
        (item: any) => state.getRowId(item) !== deleteRowId,
      );
      const newCostList = costList.filter((item: any) => state.getRowId(item) !== deleteRowId);
      const newCustomizedCostList = customizedCostList.filter(
        (item: any) => state.getRowId(item) !== deleteRowId,
      );
      set({
        mergedCostList: newMergedCostList,
        costList: newCostList,
        customizedCostList: newCustomizedCostList,
      });
    },

    calculateFinalBidTotal,

    clearStore: () => set({ ...initState }),
  };
};

const useBidPackageListStore: UseBoundStore<StoreApi<State>> = create(getStoreState);

export type State = {
  grandTotal: number;
  costTaxableTotal: number;
  finalBidTotal: number;
  hasDuplicate: boolean;
  projectId: any;
  projectProposalId: any;
  mergedCostList: MergedCostListItem[] | [];
  floorList: any[] | [];
  costList: CostListItem[] | [];
  customizedCostList: CustomizedCostListItem[] | [];
  quickEnterModalParams: any;
  addHistoryModalParams: any;
  bidCompareModalParams: any;
  bidCreateBidPackageParams: any;
  validateErrors: undefined | Object;
  collapsedRowIds: any[];
  resetRefreshKey: number;

  getRowId: (row: CostListItem & CustomizedCostListItem) => any;
  getRow: (rowId: any) => CostListItem | CustomizedCostListItem | undefined;
  deleteRowById: (rowId: any) => void;
  Event: EventType;

  setCollapsedRowIds: (val: any) => void;
  apiGetFloorList: typeof apiGetFloorListFn;
  setGrandTotal: (val: any) => void;
  setFloorList: (val: any) => void;
  setCostList: (val: any) => void;
  setCustomizedCostList: (val: any) => void;
  setMergedCostList: (val: any) => void;
  setProjectId: (val: any) => void;
  setProjectProposalId: (val: any) => void;
  setAddHistoryModalParams: (val: any) => void;
  setCreateBidPackageModalParams: (val: any) => void;
  setQuickEnterModalParams: (val: any) => void;
  selectorHasDuplicate: () => boolean;
  setFinalBidTotal: (val: any) => void;
  setFinalBidTotalCalculate: () => number;
  setCostTaxableTotal: (val: any) => void;
  setCostTaxableTotalCalculate: () => number;

  getCostItemIsDuplicate: (costItem: any) => boolean;
  getRowBidProposalItem: (rowId: any, bidProposalId: any) => any;
  setRowBidProposalItem: (rowId: any, bidProposalId: any, newValue: any) => any;

  // actions
  resetCostListOnFetch: (val: any) => State;
  addCostListOnAddBibPackage: (val: any) => State;
  resetCustomizedCostListOnFetch: (val: any) => State;
  addCustomizedCostListOnAddService: (val: any) => State;
  deleteCostListItem: (item: any) => State;
  deleteCustomizedCostListItem: (item: any) => State;
  updateCostListItem: (item: any) => State;
  addCostListOnCreateBibPackage: (item: any) => State;
  updateCustomizedCostListItem: (item: any) => State;
  updateMergedCostListItem: (item: any) => State;
  setValidateErrors: (val: any) => State;
  validate: () => false | undefined | Object;

  // get from state
  calculateFinalBidTotal: (costList: any, customizedCostList: any) => number;

  clearStore: () => void;
};

type EventName =
  | 'onDeleteRow'
  | 'onRowCompareClick'
  | 'onRowCreateBidPackageClick'
  | 'onRowCollapseChange'
  | 'onBidderItemSelect'
  | 'onRowFloorChange'
  | 'onClickQuickEnterMenu'
  | 'onRowAddHistoryClick'
  | 'onRowFinalBidChange'
  | 'onFinalBidIsEdit'
  | 'onRowSubtotalChange'
  | 'onRowTaxableTotalChange'
  | 'onRowGroupListChange'
  | 'onRowHistoryProjectProposalCustomizedCostListChange'
  | 'onRowHistoryBidProposalIdListChange'
  | 'onValidate';
type EventType = {
  on: (eventName: EventName, callback?: any) => void;
  emit: (eventName: EventName, state?: any) => void;
};

export default useBidPackageListStore;

import { evaluate } from 'mathjs';

const calculateFinalBidTotal = (costList: any, customizedCostList: any) => {
  const mergedList = [...(costList || []), ...(customizedCostList || [])];
  const finalBidTotal = mergedList.reduce((pre, currentItem) => {
    return evaluate(`${pre} + ${currentItem?.finalBid || 0}`);
  }, 0);
  return finalBidTotal;
};

const calculateCostTaxableTotal = (costList: any, customizedCostList: any) => {
  const mergedList = [...(costList || []), ...(customizedCostList || [])];
  const costTaxableTotal = mergedList.reduce((pre, currentItem) => {
    return evaluate(`${pre} + ${currentItem?.taxableSubtotal || 0}`);
  }, 0);
  return costTaxableTotal;
};
