import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { clsx } from 'clsx';

interface TabsContextValue {
  baseId: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  registerTab: (value: string, ref: HTMLButtonElement | null) => void;
  focusAdjacent: (currentValue: string, direction: 1 | -1 | 'first' | 'last') => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be used inside <Tabs>');
  return ctx;
}

export interface TabsProps {
  /** Valeur du tab actif (mode contrôlé). */
  value?: string;
  /** Valeur initiale (mode incontrôlé). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

/**
 * Tabs ARIA avec activation manuelle (cf. décision F.2).
 *
 * Usage :
 * ```tsx
 * <Tabs defaultValue="profile">
 *   <Tabs.List aria-label="Réglages">
 *     <Tabs.Tab value="profile">Profil</Tabs.Tab>
 *     <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="profile">…</Tabs.Panel>
 *   <Tabs.Panel value="notifications">…</Tabs.Panel>
 * </Tabs>
 * ```
 */
export function Tabs({ value, defaultValue, onValueChange, className, children }: TabsProps) {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const tabsRef = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const setSelectedValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const registerTab = useCallback((value: string, ref: HTMLButtonElement | null) => {
    if (ref) tabsRef.current.set(value, ref);
    else tabsRef.current.delete(value);
  }, []);

  const focusAdjacent = useCallback(
    (currentValue: string, direction: 1 | -1 | 'first' | 'last') => {
      const enabled = Array.from(tabsRef.current.entries()).filter(([, el]) => el && !el.disabled);
      if (!enabled.length) return;
      let nextIndex: number;
      if (direction === 'first') {
        nextIndex = 0;
      } else if (direction === 'last') {
        nextIndex = enabled.length - 1;
      } else {
        const currentIndex = enabled.findIndex(([v]) => v === currentValue);
        nextIndex = (currentIndex + direction + enabled.length) % enabled.length;
      }
      const entry = enabled[nextIndex];
      if (entry) entry[1]?.focus();
    },
    [],
  );

  return (
    <TabsContext.Provider
      value={{ baseId, selectedValue, setSelectedValue, registerTab, focusAdjacent }}
    >
      <div className={clsx('ori-tabs', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  'aria-label'?: string;
  className?: string;
  children?: ReactNode;
}

function TabsList({ 'aria-label': ariaLabel, className, children }: TabsListProps) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={clsx('ori-tabs__list', className)}>
      {children}
    </div>
  );
}

export interface TabsTabProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

function TabsTab({ value, disabled, className, children }: TabsTabProps) {
  const { baseId, selectedValue, setSelectedValue, registerTab, focusAdjacent } = useTabsContext();
  const isSelected = selectedValue === value;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        focusAdjacent(value, 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusAdjacent(value, -1);
        break;
      case 'Home':
        e.preventDefault();
        focusAdjacent(value, 'first');
        break;
      case 'End':
        e.preventDefault();
        focusAdjacent(value, 'last');
        break;
    }
  };

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      ref={(el) => registerTab(value, el)}
      className={clsx('ori-tabs__tab', className)}
      onClick={() => setSelectedValue(value)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  );
}

export interface TabsPanelProps {
  value: string;
  className?: string;
  children?: ReactNode;
}

function TabsPanel({ value, className, children }: TabsPanelProps) {
  const { baseId, selectedValue } = useTabsContext();
  const isActive = selectedValue === value;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={clsx('ori-tabs__panel', className)}
    >
      {isActive && children}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;
