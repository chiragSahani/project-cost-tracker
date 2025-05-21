import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase, OtherCost, getCurrentUserId } from '../lib/supabaseClient';

type OtherCostsState = {
  otherCosts: OtherCost[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: OtherCostsState = {
  otherCosts: [],
  status: 'idle',
  error: null,
};

export const fetchOtherCosts = createAsyncThunk(
  'otherCosts/fetchOtherCosts',
  async (_, { rejectWithValue }) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('other_costs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OtherCost[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch other costs');
    }
  }
);

export const addOtherCost = createAsyncThunk(
  'otherCosts/addOtherCost',
  async (
    { description, amount }: { description: string; amount: number },
    { rejectWithValue }
  ) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('other_costs')
        .insert({ description, amount, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data as OtherCost;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add other cost');
    }
  }
);

export const updateOtherCost = createAsyncThunk(
  'otherCosts/updateOtherCost',
  async (
    { id, description, amount }: { id: string; description: string; amount: number },
    { rejectWithValue }
  ) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('other_costs')
        .update({ description, amount })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as OtherCost;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update other cost');
    }
  }
);

export const deleteOtherCost = createAsyncThunk(
  'otherCosts/deleteOtherCost',
  async (id: string, { rejectWithValue }) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('other_costs')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete other cost');
    }
  }
);

const otherCostsSlice = createSlice({
  name: 'otherCosts',
  initialState,
  reducers: {
    clearOtherCostsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Other Costs
      .addCase(fetchOtherCosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOtherCosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.otherCosts = action.payload;
        state.error = null;
      })
      .addCase(fetchOtherCosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add Other Cost
      .addCase(addOtherCost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addOtherCost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.otherCosts.unshift(action.payload);
        state.error = null;
      })
      .addCase(addOtherCost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update Other Cost
      .addCase(updateOtherCost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOtherCost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.otherCosts.findIndex((cost) => cost.id === action.payload.id);
        if (index !== -1) {
          state.otherCosts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOtherCost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Delete Other Cost
      .addCase(deleteOtherCost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOtherCost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.otherCosts = state.otherCosts.filter((cost) => cost.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteOtherCost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearOtherCostsError } = otherCostsSlice.actions;
export default otherCostsSlice.reducer;