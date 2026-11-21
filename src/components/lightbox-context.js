import { createContext, use } from 'react';

/* open(projectIndex, screenIndex, buttonThatOpenedIt) */
export const LightboxContext = createContext(() => {});
export const useLightbox = () => use(LightboxContext);
