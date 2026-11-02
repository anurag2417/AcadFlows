import api from './api';

export const teacherApprovalsApi = {
  getClassRoster: () => api.get('/teachers/me/class-roster'),
};

export default teacherApprovalsApi;