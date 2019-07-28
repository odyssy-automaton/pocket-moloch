import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState({
    depositForm: false,
    rageForm: false,
  });

  function toggle(modalName) {
    setIsShowing({
      ...isShowing,
      ...{ [modalName]: !isShowing[modalName] },
    });
  }

  return {
    isShowing,
    toggle,
  };
};

export default useModal;
