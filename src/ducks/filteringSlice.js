import { createSlice } from '@reduxjs/toolkit';

export const filteringSlice = createSlice({
  name: 'filtering',
  initialState: {
    filterByName: '',
  },
  reducers: {
    setFilterByName: (state, action) => {
      state.filterByName = action.payload;
    },
  },
});

export const { setFilterByName } = filteringSlice.actions;

export default filteringSlice.reducer;
