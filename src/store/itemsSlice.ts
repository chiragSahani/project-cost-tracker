import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase, Item, getCurrentUserId } from '../lib/supabaseClient';

type ItemsState = {
  items: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ItemsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchItems = createAsyncThunk('items/fetchItems', async (_, { rejectWithValue }) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Item[];
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch items');
  }
});

export const addItem = createAsyncThunk(
  'items/addItem',
  async ({ name, cost }: { name: string; cost: number }, { rejectWithValue }) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('items')
        .insert({ name, cost, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data as Item;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item');
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async (
    { id, name, cost }: { id: string; name: string; cost: number },
    { rejectWithValue }
  ) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('items')
        .update({ name, cost })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as Item;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update item');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete item');
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearItemsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add Item
      .addCase(addItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update Item
      .addCase(updateItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Delete Item
      .addCase(deleteItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearItemsError } = itemsSlice.actions;
export default itemsSlice.reducer;