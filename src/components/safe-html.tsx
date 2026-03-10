import DOMPurify from 'dompurify';
import { useEffect, useRef } from 'react';

export function SafeHTML({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = DOMPurify.sanitize(html);
    }
  }, [html]);

  return <div ref={ref} className={className} />;
}
