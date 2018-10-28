const initialState = null;

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'ME_SET':
      return {
        uid: payload.uid,
        name: payload.name,
        img: payload.img,
      };
    case 'ME_DELETE':
      return null;
    default:
      return state;
  }
};
