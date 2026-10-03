"use client";
import { useState } from "react";
import { Button } from "./ui";
const solutions = [
  {
    title: "让文物，与观众建立联系。",
    name: "智慧文博",
    problem: "文物信息、观众服务与场馆管理需要连接，线上内容也需要持续更新。",
    approach:
      "组合文物三维采集、智慧导览、藏品与资源管理、线上展览等服务，按场馆需求分步建设。",
    outcome: "让参观服务更连贯，让文化资源在保护、研究与传播中被有效使用。",
    labels: ["数字采集", "智慧导览", "线上展览"],
  },
  {
    title: "让文化故事，发生在空间里。",
    name: "文化展示",
    problem: "文化内容需要从资料转化为叙事，同时兼顾观众理解与空间体验。",
    approach:
      "以内容策划组织展线，将空间设计、数字影像、沉浸式影院与互动展项结合。",
    outcome: "让观众看见内容、理解故事，并在参与中形成自己的文化记忆。",
    labels: ["内容叙事", "空间设计", "数字互动"],
  },
  {
    title: "把灵感，做成日常之物。",
    name: "文创开发",
    problem: "文化资源需要转化为有辨识度、可制作且适合真实生活的产品。",
    approach:
      "从馆藏与地域文化研究出发，连接 IP 策划、产品设计、生产落地与渠道协作。",
    outcome:
      "让观展与旅行中的文化发现，延续到可收藏、可使用、可分享的日常体验。",
    labels: ["文化 IP", "产品设计", "生产落地"],
  },
  {
    title: "让一次相遇，成为持续连接。",
    name: "内容与运营",
    problem: "文化空间与品牌需要持续的内容表达，并与观众建立长期沟通。",
    approach:
      "围绕文化空间、人物或品牌 IP，组织内容策划、拍摄制作、新媒体运营与活动。",
    outcome: "以明确的内容定位与持续复盘，让文化传播回应真实兴趣与需求。",
    labels: ["空间运营", "内容创作", "新媒体"],
  },
];
export function SolutionsExplorer() {
  const [active, setActive] = useState(0);
  const s = solutions[active];
  return (
    <div className="solutions-explorer">
      <div className="solution-tabs" role="tablist" aria-label="解决方案方向">
        {solutions.map((item, i) => (
          <button
            key={item.name}
            id={`tab-${i}`}
            role="tab"
            aria-selected={active === i}
            aria-controls={`panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const next = (active + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                setActive(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
              if (e.key === "Home" || e.key === "End") {
                e.preventDefault();
                const next = e.key === "Home" ? 0 : 3;
                setActive(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
            onClick={() => setActive(i)}
          >
            {item.name}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div
        className="solution-panel"
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        key={active}
      >
        <div className="solution-visual" aria-hidden="true">
          <div className="solution-core">
            {["文博", "展示", "文创", "运营"][active]}
          </div>
          {s.labels.map((l, i) => (
            <span className={`solution-node node-${i}`} key={l}>
              {l}
            </span>
          ))}
          <svg viewBox="0 0 400 360">
            <path d="M200 180 L70 90 M200 180 L330 90 M200 180 L200 310" />
          </svg>
        </div>
        <div>
          <h2>{s.title}</h2>
          <dl>
            <div>
              <dt>面对的问题</dt>
              <dd>{s.problem}</dd>
            </div>
            <div>
              <dt>我们的思路</dt>
              <dd>{s.approach}</dd>
            </div>
            <div>
              <dt>希望带来的改变</dt>
              <dd>{s.outcome}</dd>
            </div>
          </dl>
          <Button href="/contact/">讨论你的需求</Button>
        </div>
      </div>
    </div>
  );
}
