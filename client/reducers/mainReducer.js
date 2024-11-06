/**
 * ************************************
 *
 * @module  mainReducer
 * @author
 * @date
 * @description reducer for main data
 *
 * ************************************
 */
import * as types from '../constants/actionTypes';

const initialState = {
  count: 0,
};
///////////////

const mainReducer = (state = initialState, action) => {
  let newMarketList;

  switch (action.type) {
    case types.ADD:
      return Object.assign({}, state, {
        count: count + 1,
      });
      break;

    case types.MINUS:
      return Object.assign({}, state, {
        count: count - 1,
      });
      break;

    default: {
      return state;
    }
  }
};

export default mainReducer;
