import { ArrowUpRight } from "lucide-react";
import { evidence } from "@/lib/evidence";
export function EvidenceList({
  english: en = false,
  compact = false,
}: {
  english?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="evidence-list">
      {evidence.slice(0, compact ? 3 : 5).map((e) => (
        <a
          key={e.id}
          className="evidence-entry"
          href={e.url}
          target="_blank"
          rel="noreferrer"
        >
          <span className="evidence-kind">{e.kind}</span>
          <div>
            <h3>{en ? e.en : e.title}</h3>
            <p>{en ? e.enText : e.text}</p>
            <small>
              {e.source} / {e.date}
            </small>
          </div>
          <ArrowUpRight size={20} />
        </a>
      ))}
    </div>
  );
}
