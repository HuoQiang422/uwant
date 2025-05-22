import { get } from './request';

export const fetchDemandTasks = () =>
  get({ url: '/api/tasks/all' });
