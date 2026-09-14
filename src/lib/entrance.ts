"use client";

import { createContext, useContext } from "react";

export const EntranceReadyContext = createContext(true);
export const useEntranceReady = () => useContext(EntranceReadyContext);
