export function StatusStamp({
  status,
  tone = 'red'
}: {
  status: string;
  tone?: 'red' | 'blue';
}) {
  return (
    <span
      className="status-stamp"
      style={{
        color: tone === 'blue' ? 'var(--stamp-blue)' : 'var(--stamp-red)'
      }}
    >
      {status}
    </span>
  );
}
