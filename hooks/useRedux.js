import { useCallback } from "react";
import * as REDUX_ACTION_TYPES from "../redux/actionTypes";
import { useDispatch } from "react-redux";

function useRedux() {
  const storeDispatch = useDispatch();

  const _dispatchAction = useCallback(
    (action) => {
      storeDispatch(action);
    },
    [storeDispatch]
  );

  const _dispatchActionWithType = useCallback(
    (type, payload) => {
      _dispatchAction({ type, payload });
    },
    [_dispatchAction]
  );

  const dispatchAction = useCallback(
    (...args) => {
      if (!args) return;

      if (args.length === 2) {
        _dispatchActionWithType(...args);
      } else {
        if (args.length === 1) {
          if (args[0].type) {
            _dispatchAction(...args);
          } else {
            _dispatchAction({ type: args[0] });
          }
        }
      }
    },
    [_dispatchAction, _dispatchActionWithType]
  );

  return { $: REDUX_ACTION_TYPES, dispatchAction };
}

export default useRedux;
