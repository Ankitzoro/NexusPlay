import { createContext, useContext, useReducer, useEffect } from 'react';

const StoreContext = createContext(null);

const WEEKLY_FREE_GAMES = [101, 102, 103];

function storeReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        library: [],
        wishlist: [],
      };
    case 'SIGNUP':
      return { ...state, user: action.payload, isAuthenticated: true };

    case 'ADD_TO_CART': {
      const exists = state.cart.find((i) => i.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.payload),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload };
    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null };

    case 'ADD_TO_LIBRARY': {
      const exists = state.library.find((i) => i.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        library: [
          ...state.library,
          { ...action.payload, purchasedAt: new Date().toISOString() },
        ],
      };
    }
    case 'PURCHASE_CART': {
      const newLibrary = [...state.library];
      state.cart.forEach((item) => {
        if (!newLibrary.find((i) => i.id === item.id)) {
          newLibrary.push({ ...item, purchasedAt: new Date().toISOString() });
        }
      });
      return {
        ...state,
        library: newLibrary,
        cart: [],
        appliedCoupon: null,
        lastOrder: action.payload,
      };
    }

    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          wishlist: state.wishlist.filter((i) => i.id !== action.payload.id),
        };
      }
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    }

    case 'CLAIM_FREE_GAME': {
      const exists = state.library.find((i) => i.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        library: [
          ...state.library,
          {
            ...action.payload,
            purchasedAt: new Date().toISOString(),
            free: true,
          },
        ],
        claimedFreeGames: [...state.claimedFreeGames, action.payload.id],
      };
    }

    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    case 'CLEAR_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  library: [],
  wishlist: [],
  claimedFreeGames: [],
  appliedCoupon: null,
  lastOrder: null,
  toast: null,
  weeklyFreeGameIds: WEEKLY_FREE_GAMES,
};

const COUPONS = {
  NEXUS20: 20,
  GAMER50: 50,
  NEWUSER: 15,
};

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const login = (email, password) => {
    if (email && password.length >= 6) {
      const user = {
        email,
        name: email.split('@')[0],
        id: Date.now(),
        avatar: null,
      };
      dispatch({ type: 'LOGIN', payload: user });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (name, email, password) => {
    if (name && email && password.length >= 6) {
      const user = { email, name, id: Date.now(), avatar: null };
      dispatch({ type: 'SIGNUP', payload: user });
      return { success: true };
    }
    return { success: false, error: 'Please fill all fields correctly' };
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  const addToCart = (game) => {
    if (state.library.find((i) => i.id === game.id)) {
      showToast('Already in your library!', 'warn');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: game });
    showToast(`${game.name} added to cart!`);
  };

  const removeFromCart = (id) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  const applyCoupon = (code) => {
    const discount = COUPONS[code.toUpperCase()];
    if (discount) {
      dispatch({
        type: 'APPLY_COUPON',
        payload: { code: code.toUpperCase(), discount },
      });
      return { success: true, discount };
    }
    return { success: false, error: 'Invalid coupon code' };
  };

  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });

  const purchaseCart = (orderDetails) => {
    dispatch({ type: 'PURCHASE_CART', payload: orderDetails });
    showToast('Purchase successful! Games added to library.');
  };

  const toggleWishlist = (game) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: game });
    const isInWishlist = state.wishlist.find((i) => i.id === game.id);
    showToast(
      isInWishlist
        ? 'Removed from wishlist'
        : `${game.name} added to wishlist!`,
    );
  };

  const claimFreeGame = (game) => {
    if (!state.isAuthenticated) {
      showToast('Please login to claim free games!', 'warn');
      return false;
    }
    dispatch({ type: 'CLAIM_FREE_GAME', payload: game });
    showToast(`${game.name} claimed! Check your library.`);
    return true;
  };

  const addToLibrary = (game) =>
    dispatch({ type: 'ADD_TO_LIBRARY', payload: game });

  const showToast = (message, type = 'success') => {
    dispatch({ type: 'SET_TOAST', payload: { message, type } });
    setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3000);
  };

  const cartTotal = state.cart.reduce((sum, item) => {
    const price = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + price;
  }, 0);

  const discountedTotal = state.appliedCoupon
    ? cartTotal * (1 - state.appliedCoupon.discount / 100)
    : cartTotal;

  const isInCart = (id) => state.cart.some((i) => i.id === id);
  const isInLibrary = (id) => state.library.some((i) => i.id === id);
  const isInWishlist = (id) => state.wishlist.some((i) => i.id === id);
  const isWeeklyFree = (id) => state.weeklyFreeGameIds.includes(id);
  const hasClaimed = (id) => state.claimedFreeGames.includes(id);

  return (
    <StoreContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        addToCart,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        purchaseCart,
        toggleWishlist,
        claimFreeGame,
        addToLibrary,
        showToast,
        cartTotal,
        discountedTotal,
        isInCart,
        isInLibrary,
        isInWishlist,
        isWeeklyFree,
        hasClaimed,
        COUPONS,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
};
