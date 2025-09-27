import { useEffect, useState } from 'react';

const useDelayedVisibility = (visible, { delayIn = 300, minimumVisible = 400 } = {}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let showTimer;
    let hideTimer;

    if (visible) {
      showTimer = window.setTimeout(() => setShouldRender(true), delayIn);
    } else if (shouldRender) {
      hideTimer = window.setTimeout(() => setShouldRender(false), minimumVisible);
    }

    return () => {
      if (showTimer) {
        window.clearTimeout(showTimer);
      }
      if (hideTimer) {
        window.clearTimeout(hideTimer);
      }
    };
  }, [delayIn, minimumVisible, visible, shouldRender]);

  return shouldRender;
};

export default useDelayedVisibility;
