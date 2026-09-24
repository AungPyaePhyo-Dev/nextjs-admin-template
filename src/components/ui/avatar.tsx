import { cn } from '@/lib/utils';

const PALETTE = [
  'bg-slate-800 text-white',
  'bg-indigo-600 text-white',
  'bg-emerald-600 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-sky-600 text-white',
  'bg-violet-600 text-white',
  'bg-teal-600 text-white',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]!;
}

interface AvatarProps {
  name: string;
  seed?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'size-7 text-[11px] rounded-md',
  md: 'size-9 text-xs rounded-lg',
  lg: 'size-10 text-sm rounded-lg',
};

export function Avatar({ name, seed, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center font-semibold tracking-wide shrink-0',
        SIZES[size],
        colorFor(seed ?? name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
