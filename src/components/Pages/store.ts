import { create } from 'zustand';
import EventEmitter from '../../utils/EventEmitter';

export type State = ReturnType<typeof getState>;

export type Page = { name: string; index: number };

export const getState = (set, get) => {
  const Event = new EventEmitter();

  return {
    Event,

    currentPageIndex: 0,

    currentPage: { index: 0 },

    pagesNameMap: {} as Record<string, Page>,

    pagesIndexMap: {} as Record<string, Page>,

    setCurrentPageIndex: (i: number) => {
      const { pagesIndexMap } = get() as State;
      const currentPage = pagesIndexMap[i];
      set({ currentPageIndex: i, currentPage });
    },

    registerPage: (options: Page) => {
      const { pagesNameMap, pagesIndexMap } = get() as State;
      const { name, index } = options;
      const newPage = { name, index, };
      const newPagesNameMap = { ...pagesNameMap, [name]: newPage };
      const newPagesIndexMap = { ...pagesIndexMap, [index]: newPage };
      set({ pagesNameMap: newPagesNameMap, pagesIndexMap: newPagesIndexMap });
    },

    navigationTo: (n: number | string) => {
      const { currentPageIndex: fromPageIndex, pagesNameMap, pagesIndexMap } = get() as State;
      const navigationToPageIndex = typeof n === 'number' ? n : pagesNameMap[n].index;
      const currentPage = pagesIndexMap[navigationToPageIndex];
      set({ currentPageIndex: navigationToPageIndex, currentPage });
      Event.emit('navigationTo', { toPageIndex: navigationToPageIndex, fromPageIndex });
    },

    next: () => {
      const { currentPageIndex, pagesIndexMap } = get() as State;
      const isMaxPageIndex = currentPageIndex >= Object.keys(pagesIndexMap).length - 1;
      if (isMaxPageIndex) return console.log('Max page index');
      const nextIndex = Number(currentPageIndex) + 1;
      const currentPage = pagesIndexMap[nextIndex];
      Event.emit('next', { currentIndex: currentPageIndex, nextIndex });
      set({ currentPageIndex: nextIndex, currentPage });
    },

    pre: () => {
      const { currentPageIndex, pagesIndexMap } = get() as State;
      const isMinPageIndex = currentPageIndex <= 0;
      if (isMinPageIndex) return console.log('Min page index');
      const preIndex = Number(currentPageIndex) - 1;
      const currentPage = pagesIndexMap[preIndex];
      Event.emit('pre', { currentIndex: currentPageIndex, preIndex });
      set({ currentPageIndex: preIndex, currentPage });
    }
  }
};

export const usePagesStore = create(getState);