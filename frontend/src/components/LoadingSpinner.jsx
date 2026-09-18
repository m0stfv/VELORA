import { Loader } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader size={28} className="animate-spin text-clay" aria-label="Loading" />
    </div>
  );
}
