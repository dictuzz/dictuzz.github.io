export function CaseStamp({ caseNumber }: { caseNumber: string }) {
  return (
    <div className="case-stamp-circle">
      <span className="px-2 text-center leading-tight">Case {caseNumber}</span>
    </div>
  );
}
