export default function ProgressBar({ loading, progress }: { loading: boolean; progress?: number | null }) {
  if (!loading) return null;
  const determinate = typeof progress === 'number' && progress >= 0 && progress <= 1;
  return (
    <div className={`progress-bar ${determinate ? 'determinate' : 'indeterminate'}`} aria-hidden={!loading}>
      {determinate ? <div className="progress-fill" style={{ transform: `scaleX(${progress})` }} /> : <div className="progress-anim" />}
    </div>
  );
}
