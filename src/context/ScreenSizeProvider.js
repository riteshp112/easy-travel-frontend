import React, {createContext, useEffect, useMemo, useState} from 'react';
export const ScreenSizeContext = createContext({
  width: 0,
  isMobile: false,
});

export const ScreenSizeProvider = ({children}) => {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = useMemo(() => width <= 768, [width]);

  return (
    <ScreenSizeContext.Provider value={{width, isMobile}}>
      {children}
    </ScreenSizeContext.Provider>
  );
};
