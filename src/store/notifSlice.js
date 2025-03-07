import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch notifications
export const fetchNotifs = createAsyncThunk(
    'notifications/fetchNotifs',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().auth; // Ambil user dari Redux state
            const endpoint =
                user.role == '3'
                    ? `${import.meta.env.VITE_APP_API_URL}/api/notif/${user.kabupaten}`
                    : `${import.meta.env.VITE_APP_API_URL}/api/notif`;

            const response = await axios.get(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
            });

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Terjadi kesalahan');
        }
    }
);

// Mark notification as read
export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notifId, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().auth; // Ambil user dari Redux state
            await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/notif/read/${notifId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            return notifId;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Terjadi kesalahan');
        }
    }
);

// Slice
const notifSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifs: [],
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        clearNotifs: (state) => {
            state.notifs = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifs.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchNotifs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notifs = action.payload;
            })
            .addCase(fetchNotifs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Gagal mengambil notifikasi';
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notif = state.notifs.find((n) => n.id == action.payload);
                if (notif) {
                    notif.is_read = '1';
                }
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.error = action.payload || 'Gagal menandai notifikasi';
            });
    },
});

export const { clearNotifs } = notifSlice.actions;
export default notifSlice.reducer;
