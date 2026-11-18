import { Info, LayoutGrid, Shield, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AppMode } from '../lib/appMode';
import type { View } from '../types';

export function AppShell({
  mode,
  view,
  setView,
  children,
  onHelp,
}: {
  mode: AppMode;
  view: View;
  setView: (view: View) => void;
  children: ReactNode;
  onHelp?: () => void;
}) {
  const isPlanner = mode === 'planner';
  const activeNav = view === 'runbook' ? 'matrix' : view === 'inspector' ? 'hub' : view;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#17233c]">
      <header className="sticky top-0 z-40 border-b border-[#dfe4ee] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-5 px-5 md:px-8 lg:px-10">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => setView(isPlanner ? 'matrix' : 'hub')}
            type="button"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#3446a5] text-white shadow-[0_6px_18px_rgba(52,70,165,.22)]">
              <Shield size={21} />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[15px] font-bold leading-tight tracking-[-.01em]">
                {isPlanner ? 'Andrew’s planner' : 'Apple Account'}
              </span>
              <span className="block text-[12px] font-medium text-[#69748c]">
                {isPlanner ? 'Master Matrix & runbook' : 'Check & Untangler'}
              </span>
            </span>
          </button>

          {isPlanner ? (
            <nav
              aria-label="Planner views"
              className="ml-auto flex items-center rounded-xl bg-[#f1f3f8] p-1"
            >
              <button
                aria-current={activeNav === 'matrix' ? 'page' : undefined}
                className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition md:px-4 ${
                  activeNav === 'matrix'
                    ? 'bg-white text-[#30419a] shadow-sm'
                    : 'text-[#657086] hover:text-[#26324b]'
                }`}
                onClick={() => setView('matrix')}
                type="button"
              >
                <Users size={17} className="hidden md:block" />
                <span>Master Matrix</span>
              </button>
            </nav>
          ) : (
            <nav
              aria-label="Collect views"
              className="ml-auto flex items-center rounded-xl bg-[#f1f3f8] p-1"
            >
              <button
                aria-current={activeNav === 'hub' ? 'page' : undefined}
                className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition md:px-4 ${
                  activeNav === 'hub'
                    ? 'bg-white text-[#30419a] shadow-sm'
                    : 'text-[#657086] hover:text-[#26324b]'
                }`}
                onClick={() => setView('hub')}
                type="button"
              >
                <LayoutGrid size={17} className="hidden md:block" />
                <span>Devices</span>
              </button>
            </nav>
          )}

          <button
            aria-label="Help and information"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#dfe4ee] text-[#5e6a81] hover:bg-[#f5f7fb]"
            onClick={onHelp}
            type="button"
          >
            <Info size={19} />
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
