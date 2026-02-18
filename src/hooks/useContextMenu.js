import { useState, useCallback, useEffect } from 'react';

export const useContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleContextMenu = useCallback((event, item) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorPoint({ x: event.pageX, y: event.pageY });
    setShow(true);
    setSelectedItem(item);
  }, []);

  const handleClick = useCallback(() => {
    if (show) setShow(false);
  }, [show]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  return { anchorPoint, show, setShow, selectedItem, handleContextMenu };
};
