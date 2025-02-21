import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { notificationsReducer } from './notifications/notificationsSlice'

const rootPersistConfig = {
    key: 'root',
    storage,
    whitelist: ['user']
}

const reducers = combineReducers({
    activeCard: activeCardReducer,
    activeBoard: activeBoardReducer,
    user: userReducer,
    notifications: notificationsReducer
})

const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
