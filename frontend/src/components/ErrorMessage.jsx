import { AlertCircle, RotateCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="my-4 flex items-center gap-3 border border-clay/30 bg-stone/60 p-4 text-ink">
      <AlertCircle size={21} className="shrink-0 text-clay" />
      <div className="flex-1"><p className="text-[10px] font-medium tracking-[0.16em] text-clay">UNABLE TO LOAD</p><p className="text-sm text-ink-soft">{message || 'Something went wrong.'}</p></div>
      {onRetry && <button type="button" onClick={onRetry} className="flex items-center gap-2 border border-ink px-3 py-2 text-[10px] font-medium tracking-[0.12em] hover:bg-ink hover:text-cream"><RotateCw size={13} /> RETRY</button>}
    </div>
  );
}
