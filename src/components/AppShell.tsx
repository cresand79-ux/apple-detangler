import { Info, LayoutGrid, Shield, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import type { View } from '../types';

const navItems: { id: View; label: string; short: string; icon: typeof Shield }[] = [
  { id: 'hub', label: 'Devices', short: '01', icon: LayoutGrid },
  { id: 'inspector', label: 'Inspector', short: '02', icon: Shield },
  { id: 'matrix', label: 'Master Matrix', short: '03', icon: Users },
];

export function AppShell({
  view,
  setView,
  children,
  onHelp,
}: {
  view: View;
  setView: (view: View) => void;
  children: ReactNode;
  onHelp?: () => void;
}) {
  const activeNav = view === 'runbook' ? 'matrix' : view;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#17233c]">
      <header className="sticky top-0 z-40 border-b border-[#dfe4ee] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-5 px-5 md:px-8 lg:px-10">
          <button className="flex items-center gap-3 text-left" onClick={() => setView('hub')} type="button">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#3446a5] text-white shadow-[0_6px_18px_rgba(52,70,165,.22)]">
              <Shield size={21} />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[15px] font-bold leading-tight tracking-[-.01em]">
                Apple Account
              </span>
              <span className="block text-[12px] font-medium text-[#69748c]">
                Check & Untangler
              </span>
            </span>
          </button>
          <nav
            aria-label="Main views"
            className="ml-auto flex items-center rounded-xl bg-[#f1f3f8] p-1"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  aria-current={activeNav === item.id ? 'page' : undefined}
                  className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition md:px-4 ${
                    activeNav === item.id
                      ? 'bg-white text-[#30419a] shadow-sm'
                      : 'text-[#657086] hover:text-[#26324b]'
                  }`}
                  key={item.id}
                  onClick={() => setView(item.id)}
                  type="button"
                >
                  <span className="hidden md:block">
                    <Icon size={17} />
                  </span>
                  <span className="md:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <button
            aria-label="Help and information"
            className="hidden h-10 w-10 place-items-center rounded-xl border border-[#dfe4ee] text-[#5e6a81] hover:bg-[#f5f7fb] md:grid"
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
