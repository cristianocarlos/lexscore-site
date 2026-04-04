import Logo from '@/layout/header/Logo';
import PracticalHeader from '@/layout/header/PracticalHeader';

export default function Header() {
  const height = 80;
  return (
    <PracticalHeader className="bg-blue-800" height={height}>
      <header className="agg--layout-canvas-width flex h-20 items-center gap-8">
        <div className="flex justify-center flex-1">
          <Logo className="block w-40" />
        </div>
      </header>
    </PracticalHeader>
  );
}
