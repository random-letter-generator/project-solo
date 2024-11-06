import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './reducers/mainReducer';

// modern redux toolkit `configureStore()` -- https://redux-toolkit.js.org/api/configureStore
const store = configureStore({
  reducer: {
    main: mainReducer,
    // if we had other reducers, they would go here
  },
});

export default store;
