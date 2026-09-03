export interface Project {
  id: string;
  name: string;
  region: string;
  createdAt: string;
  analysisCount: number;
}

export const projectStore = {
  activeProjectId: 'proj-default-01',
  projects: [
    {
      id: 'proj-default-01',
      name: 'Telangana & AP Remote Sensing Survey',
      region: 'Hyderabad, India',
      createdAt: '2026-03-01T00:00:00Z',
      analysisCount: 5,
    },
  ] as Project[],

  getActiveProject() {
    return this.projects.find((p) => p.id === this.activeProjectId);
  },
};
