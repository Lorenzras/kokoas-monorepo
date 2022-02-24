
import { KeyPayload, MemoFormState } from './../../../types/form.memo';

const changeCheckedAgent = (state : MemoFormState, payload : KeyPayload ): MemoFormState => {

  return { ...state, notifyTo: {
    ...state.notifyTo,
    [payload.key]: !state.notifyTo[payload.key],
  } };
};

export default changeCheckedAgent;