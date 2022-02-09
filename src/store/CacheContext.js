import React from 'react';

let CacheContext = React.createContext();

let initialState = {
  cachedImgs: {}
};

let reducer = (state, action) => {
	
  switch (action.type) {
    case "cache_image":
      return {
            ...state,
            cachedImgs: {
              ...state.cachedImgs, 
              [action.url]: action.response}
          };
    default:
      return action.obj;
    
  }
};

function CacheContextProvider(props) {

  let [CacheState, CacheDispatch] = React.useReducer(reducer, initialState);
  
  let value = { CacheState, CacheDispatch };

  return (
    <CacheContext.Provider value={value}>{props.children}</CacheContext.Provider>
  );
}

let CacheContextConsumer = CacheContext.Consumer;

export { CacheContext, CacheContextProvider, CacheContextConsumer };