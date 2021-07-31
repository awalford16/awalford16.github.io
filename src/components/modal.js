import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [currentContent, setCurrentContent] = useState({});

  function toggle(content) {
    console.log(content);
    if (isShowing && content.name == currentContent.name) {
      setIsShowing(false);
      return;
    } 
      
    setIsShowing(true);
    setCurrentContent(content);
  }

  return {
    isShowing,
    toggle,
    currentContent
  }
};

export default useModal;