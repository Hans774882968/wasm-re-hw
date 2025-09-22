import { clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text) {
  if (typeof navigator === 'undefined') return;
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success('复制成功');
    })
    .catch((e) => {
      const msg = `复制出错：${e}`;
      console.error(msg);
      toast.error(msg);
    });
}
