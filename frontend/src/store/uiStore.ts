export const uiStore = {
  isSidebarOpen: true,
  activeTab: 'workspace',
  theme: 'space',

  setSidebarOpen(open: boolean) {
    this.isSidebarOpen = open;
  },

  setActiveTab(tab: string) {
    this.activeTab = tab;
  },
};
