import { FaTrophy } from 'react-icons/fa';

export default function Celebration() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-bounce text-6xl text-yellow-500">
        <FaTrophy />
      </div>
      <div className="absolute animate-ping w-64 h-64 rounded-full bg-yellow-500" />
    </div>
  );
}
