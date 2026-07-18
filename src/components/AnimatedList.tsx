import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import "./AnimatedList.scss";

/**
 * Scrollable list with scroll-in animation, edge gradients and keyboard
 * navigation. Ported from React Bits (AnimatedList) to TypeScript + SCSS.
 *
 * Arrow/Tab handling is scoped to the list instead of `window`, so the page's
 * other inputs keep their normal keyboard behaviour.
 */

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter: () => void;
  onClick: () => void;
}

function AnimatedItem({ children, delay = 0, index, onMouseEnter, onClick }: AnimatedItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} data-index={index} onMouseEnter={onMouseEnter} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListProps<T> {
  items: T[];
  /** Renders one row. Defaults to plain text. */
  renderItem?: (item: T, index: number, selected: boolean) => ReactNode;
  onItemSelect?: (item: T, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

export function AnimatedList<T>({
  items,
  renderItem,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
}: AnimatedListProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleItemMouseEnter = useCallback((index: number) => setSelectedIndex(index), []);

  const handleItemClick = useCallback(
    (item: T, index: number) => {
      setSelectedIndex(index);
      onItemSelect?.(item, index);
    },
    [onItemSelect],
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  // keyboard nav, scoped to the list (see note above)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!enableArrowNavigation) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          onItemSelect?.(items[selectedIndex], selectedIndex);
        }
      }
    },
    [enableArrowNavigation, items, selectedIndex, onItemSelect],
  );

  // keep the keyboard-selected row in view
  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selected = container.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    if (selected) {
      const margin = 50;
      const itemTop = selected.offsetTop;
      const itemBottom = itemTop + selected.offsetHeight;
      if (itemTop < container.scrollTop + margin) {
        container.scrollTo({ top: itemTop - margin, behavior: "smooth" });
      } else if (itemBottom > container.scrollTop + container.clientHeight - margin) {
        container.scrollTo({ top: itemBottom - container.clientHeight + margin, behavior: "smooth" });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  // recompute the bottom gradient when the list content changes
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    setTopGradientOpacity(0);
    setBottomGradientOpacity(el.scrollHeight <= el.clientHeight ? 0 : 1);
    el.scrollTop = 0;
  }, [items]);

  return (
    <div className={`animated-list ${className}`}>
      <div
        ref={listRef}
        className={`animated-list__scroll ${displayScrollbar ? "" : "animated-list__scroll--no-bar"}`}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={enableArrowNavigation ? 0 : -1}
        role="listbox"
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >
            <div
              className={`animated-list__item ${selectedIndex === index ? "is-selected" : ""} ${itemClassName}`}
              role="option"
              aria-selected={selectedIndex === index}
            >
              {renderItem ? (
                renderItem(item, index, selectedIndex === index)
              ) : (
                <p className="animated-list__text">{String(item)}</p>
              )}
            </div>
          </AnimatedItem>
        ))}
      </div>

      {showGradients && (
        <>
          <div className="animated-list__grad animated-list__grad--top" style={{ opacity: topGradientOpacity }} />
          <div className="animated-list__grad animated-list__grad--bottom" style={{ opacity: bottomGradientOpacity }} />
        </>
      )}
    </div>
  );
}
