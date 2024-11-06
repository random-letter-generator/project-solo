/**
 * ************************************
 *
 * @module  actions.js
 * @author
 * @date
 * @description Action Creators
 *
 * ************************************
 */

// import actionType constants
import * as types from '../constants/actionTypes';

export const addActionCreator = () => ({
  type: types.ADD,
  payload: null,
});

export const minusActionCreator = () => ({
  type: types.MINUS,
  payload: null,
});
