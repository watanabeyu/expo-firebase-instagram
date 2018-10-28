const initialState = null;

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SCREEN_SET':
      return payload.current;
    default:
      return state;
  }
};
