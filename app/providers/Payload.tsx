import type { Payload } from "payload";
import { createContext, useContext } from "react";

export const PayloadContext = createContext<Payload | undefined>(undefined);

export const usePayload = () => useContext(PayloadContext);
