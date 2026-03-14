import { useAppSelector } from '@/hooks/use-store';
import { useLogout } from '@/hooks/use-logout';
import { Link } from '@tanstack/react-router';
import { LayoutList, LogIn, LogOut, Trophy } from 'lucide-react';
import { TEST_IDS } from '@/test-ids';

const navItems = [
  { to: '/leaderboards', label: 'Leaderboard', icon: Trophy },
  { to: '/', label: 'Threads', icon: LayoutList },
] as const;

export function BottomNavBar() {
  const auth = useAppSelector((state) => state.auth);
  const { mutate: logout } = useLogout();

  return (
    <nav className="flex h-14 items-center justify-around border-t bg-background px-4">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground [&.active]:text-primary"
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
      {auth ? (
        <button
          type="button"
          onClick={() => logout()}
          data-testid={TEST_IDS.NAV_BAR.LOGOUT_BUTTON}
          className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground"
        >
          <LogOut className="size-5" />
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          data-testid={TEST_IDS.NAV_BAR.LOGIN_BUTTON}
          className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground [&.active]:text-primary"
        >
          <LogIn className="size-5" />
          Login
        </Link>
      )}
    </nav>
  );
}
