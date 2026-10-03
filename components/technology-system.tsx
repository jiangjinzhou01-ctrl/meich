"use client";
import { useState } from "react";
const nodes = [
  {
    name: "文化研究",
    en: "CULTURE",
    text: "理解文物、历史与地域文化，梳理资料与叙事线索，为内容策划和创意设计建立基础。",
  },
  {
    name: "创意设计",
    en: "CREATIVE",
    text: "连接内容策划、空间叙事与视觉表达，让文化内容形成清晰、连续的展示体验。",
  },
  {
    name: "数字影像",
    en: "FILM",
    text: "通过数字影片、三维动画与沉浸式影像，让文化信息获得适合空间的视觉表达。",
  },
  {
    name: "AI 共创",
    en: "AI",
    text: "结合 AI 影像与个性化文化体验，探索内容生成与互动应用。多模态虚实交互等方向处于研发探索中。",
  },
  {
    name: "三维采集",
    en: "3D DATA",
    text: "将文物与场景转化为数字资源，通过三维采集、建模和可视化支持保护、研究与传播。",
  },
  {
    name: "交互体验",
    en: "INTERACTION",
    text: "结合体感、手势、VR 与空间投影等交互方式，把观众的参与融入文化叙事。",
  },
  {
    name: "智慧软件",
    en: "SOFTWARE",
    text: "以智慧博物馆平台连接观众服务、资源管理与数字内容，组合导览、云展览和知识服务。",
  },
  {
    name: "系统集成",
    en: "INTEGRATION",
    text: "连接显示、声音、互动感应与多媒体中控，通过现场联调让不同技术成为完整的体验系统。",
  },
];
export function TechnologySystem() {
  const [active, setActive] = useState(0);
  return (
    <div className="technology-system">
      <div className="tech-map">
        <div className="tech-center">
          美创<span>CULTURE × TECH</span>
        </div>
        <div className="tech-ring" />
        {nodes.map((n, i) => (
          <button
            key={n.en}
            className={`tech-node tech-node-${i} ${active === i ? "selected" : ""}`}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
          >
            {n.name}
            <span>{n.en}</span>
          </button>
        ))}
      </div>
      <div className="tech-description" aria-live="polite">
        <span>能力连接</span>
        <h2>{nodes[active].name}</h2>
        <p>{nodes[active].text}</p>
        <small>
          依据美创官网公开能力整理。具体配置与研发成果的应用范围，在项目评估后确认。
        </small>
      </div>
    </div>
  );
}
