import { create } from "zustand";

export type State = ReturnType<typeof getState>;

export const getState = (set, get) => {
  return {
    zustandWebsiteVisible: false,

    showZustandWebsite: () => {
      set({ zustandWebsiteVisible: true });
    },

    closeZustandWebsite: () => {
      set({ zustandWebsiteVisible: false });
    },
  };
};

export const useMenuStore = create(getState);
