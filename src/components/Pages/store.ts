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

    pageIndexUsed: [0],

    setCurrentPageIndex: (i: number) => {
      const { pagesIndexMap, pageIndexUsed } = get() as State;
      const currentPage = pagesIndexMap[i];
      const newpageIndexUsed = [...pageIndexUsed, i];
      set({ currentPageIndex: i, currentPage, pageIndexUsed: newpageIndexUsed });
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
      const { currentPageIndex: fromPageIndex, pagesNameMap, setCurrentPageIndex } = get() as State;
      const navigationToPageIndex = typeof n === 'number' ? n : pagesNameMap[n].index;
      setCurrentPageIndex(navigationToPageIndex);
      Event.emit('navigationTo', { toPageIndex: navigationToPageIndex, fromPageIndex });
    },

    next: () => {
      const { currentPageIndex, pagesIndexMap, setCurrentPageIndex } = get() as State;
      const isMaxPageIndex = currentPageIndex >= Object.keys(pagesIndexMap).length - 1;
      if (isMaxPageIndex) return console.log('Max page index');
      const nextIndex = Number(currentPageIndex) + 1;
      Event.emit('next', { currentIndex: currentPageIndex, nextIndex });
      setCurrentPageIndex(nextIndex);
    },

    pre: () => {
      const { currentPageIndex, setCurrentPageIndex } = get() as State;
      const isMinPageIndex = currentPageIndex <= 0;
      if (isMinPageIndex) return console.log('Min page index');
      const preIndex = Number(currentPageIndex) - 1;
      Event.emit('pre', { currentIndex: currentPageIndex, preIndex });
      setCurrentPageIndex(preIndex);
    }
  }
};

export const usePagesStore = create(getState);