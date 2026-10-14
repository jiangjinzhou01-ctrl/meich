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
          className="evidence-entry" data-reveal-group
          href={e.url}
          target="_blank"
          rel="noreferrer"
        >
          <span className="evidence-kind" data-reveal="content" data-reveal-order="0">{e.kind}</span>
          <div>
            <h3 data-reveal="content" data-reveal-order="1">{en ? e.en : e.title}</h3>
            <p data-reveal="content">{en ? e.enText : e.text}</p>
            <small data-reveal="content">
              {e.source} / {e.date}
            </small>
          </div>
          <ArrowUpRight size={20} />
        </a>
      ))}
    </div>
  );
}
