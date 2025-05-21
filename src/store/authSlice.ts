import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabaseClient';

export type User = {
  id: string;
  email: string;
};

type AuthState = {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return data.user ? { id: data.user.id, email: data.user.email || '' } : null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign up');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data.user ? { id: data.user.id, email: data.user.email || '' } : null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign in');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return null;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to sign out');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.status = 'succeeded';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;