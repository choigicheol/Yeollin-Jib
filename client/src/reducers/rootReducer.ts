import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import authReducer from "./authReducer";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["authReducer"],
};

// authReducer에 isInValid를 새로고침시 초기화되도록 블랙리스트로 설정
const authReducerConfig = {
  key: "authReducer",
  storage,
  blacklist: ["isInValid"],
};

const rootReducer = combineReducers({
  authReducer: persistReducer(authReducerConfig, authReducer),
});

export type RootState = ReturnType<typeof rootReducer>;

export default persistReducer(persistConfig, rootReducer);
