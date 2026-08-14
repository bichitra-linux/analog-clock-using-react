import { useEffect } from 'react';

const handlers = [];

export const useBackPress = (handler) => {
  useEffect(() => {
    if (!handler) return undefined;
    handlers.push(handler);
    return () => {
      const index = handlers.indexOf(handler);
      if (index !== -1) handlers.splice(index, 1);
    };
  }, [handler]);
};

export const handleBackPress = () => {
  for (let i = handlers.length - 1; i >= 0; i -= 1) {
    if (handlers[i]()) return true;
  }
  return false;
};
