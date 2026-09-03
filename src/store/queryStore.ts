export const queryStore = {
  recentQueries: [
    'Where did urban expansion occur between 2022 and 2026?',
    'Highlight the central lake reservoir and wetlands',
    'Fuse optical and SAR to identify structures through haze',
    'Describe dominant land cover and urban density',
  ],

  addQuery(q: string) {
    if (!this.recentQueries.includes(q)) {
      this.recentQueries.unshift(q);
    }
  },

  getRecentQueries() {
    return this.recentQueries;
  },
};
