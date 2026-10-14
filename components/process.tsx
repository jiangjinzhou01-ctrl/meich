import { steps } from "@/lib/content";
import { SectionLabel } from "./ui";
export function Process() {
  return (
    <section className="section container process-section">
      <div className="section-heading">
        <div>
          <h2 data-reveal="editorial">
            好的合作，
            <br />
            从清晰开始。
          </h2>
        </div>
      </div>
      <ol className="process-grid">
        {steps.map((s, i) => (
          <li key={s.title} data-reveal-group>
            <span className="process-number">0{i + 1}</span>
            <div className="process-node" />
            <h3 data-reveal="editorial">
              {s.title}
              <small>{s.en}</small>
            </h3>
            <p data-reveal="content">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
