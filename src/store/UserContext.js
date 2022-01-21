import React from 'react';

let UserContext = React.createContext();

let initialState = {
  logged: false,
  theme: 'dark',
  userData: {
  },
  isOwner: false,
  mintEvent: {},
  mintAddresses: [],
  txs: [],
  subscriptions: null,
  openModal: false,
  modalContent: {}
};

let reducer = (state, action) => {
	
  switch (action.type) {
    case "update":
      return {
        ...state,
        ...action.obj
      };
    case "logout":
      return initialState;
    case "add_transaction":
      if(action.tx && action.tx.tx_id) {
        let exists = state.txs.find(tx => tx.tx_id === action.tx.tx_id)
        if(exists) {
          return {
            ...state,
            txs: state.txs.map(tx => {
              return (tx.tx_id === action.tx.tx_id) ? {...tx, ...action.tx} : tx
            })
          };
        } else {
          return {
            ...state,
            txs: [...state.txs, action.tx]
          };
        }
      } else {
        return {...state}
      }
    case "open_modal":
      return {
            ...state,
            openModal: true,
            modalContent: action.punk
          };
    case "close_modal":
      return {
            ...state,
            openModal: false,
            modalContent: {}
          };
    case "update_transaction":
      let exists = state.txs.find(tx => tx.tx_id === action.tx_id)
      if(action.tx_ && action.tx.tx_id) {
        let exists = state.txs.find(tx => tx.tx_id === action.tx.tx_id)
        if(exists) {
          return {
            ...state,
            txs: state.txs.map(tx => {
              return (tx.tx_id === action.tx.tx_id) ? {...tx, ...action.tx} : tx
            })
          };
        } 
      } 
      return {...state}
    case "set_subscription":
      return {
        ...state,
        subscriptions: action.subscriptions
      }
    case "change_theme":
      return {
        ...state,
        theme: action.theme
      };
    default:
      return action.obj;
    
  }
};

function UserContextProvider(props) {

  let [UserState, UserDispatch] = React.useReducer(reducer, initialState);
  
  let value = { UserState, UserDispatch };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}

let UserContextConsumer = UserContext.Consumer;

export { UserContext, UserContextProvider, UserContextConsumer };