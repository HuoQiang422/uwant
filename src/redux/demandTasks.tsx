import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDemandTasks } from '../utils/demandTaskApi';
import { DemandTaskItem } from '../types/demandTask';

export const getDemandTasks = createAsyncThunk(
  'demandTasks/getDemandTasks',
  async () => {
    const res = await fetchDemandTasks();
    // 你的后端如果包了一层data就用res.data，否则直接用res
    return res.data || res;
  }
);

const demandTasksSlice = createSlice({
  name: 'demandTasks',
  initialState: {
    tasks: [] as DemandTaskItem[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getDemandTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDemandTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getDemandTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '加载失败';
      });
  },
});

export default demandTasksSlice.reducer;