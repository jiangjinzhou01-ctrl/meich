"use client";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui";
const directions = [
  {
    name: "空间与创意设计",
    category: "设计",
    text: "理解文化内容，把叙事、空间与视觉表达连接起来。",
    skills: ["展陈与空间设计", "文化内容与视觉", "互动体验"],
  },
  {
    name: "技术与工程",
    category: "技术",
    text: "关心实现，也关心质量。用清晰的系统结构回应真实业务问题。",
    skills: ["智慧软件与系统", "数字影像与多媒体", "技术集成"],
  },
  {
    name: "业务与协作",
    category: "业务",
    text: "理解业务目标，保持清晰沟通，让不同能力共同完成有价值的工作。",
    skills: ["需求理解", "项目协同", "商务沟通"],
  },
];
export function CareersList() {
  const [filter, setFilter] = useState("全部");
  const [selected, setSelected] = useState<(typeof directions)[number] | null>(
    null,
  );
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  return (
    <>
      <div className="careers-heading">
        <div>
          <h2>找到你的方向。</h2>
          <p>
            以下为人才交流方向，非正式在招岗位。招聘职位、地点与要求待确认。
          </p>
        </div>
        <div className="career-filters" aria-label="人才方向筛选">
          {["全部", "设计", "技术", "业务"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="careers-grid">
        {directions
          .filter((d) => filter === "全部" || d.category === filter)
          .map((d) => (
            <button
              className="career-card"
              key={d.name}
              onClick={() => setSelected(d)}
            >
              <span>人才交流方向</span>
              <h3>{d.name}</h3>
              <p>{d.text}</p>
              <div>
                地点待确认<span aria-hidden="true">↗</span>
              </div>
            </button>
          ))}
      </div>
      <dialog
        ref={dialog}
        className="career-dialog"
        aria-labelledby="career-dialog-title"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setSelected(null);
        }}
      >
        <div className="dialog-inner">
          <button
            className="icon-button dialog-close"
            onClick={() => setSelected(null)}
            aria-label="关闭方向说明"
          >
            <X />
          </button>
          <span>人才方向 / 非正式在招岗位</span>
          <h2 id="career-dialog-title">{selected?.name}</h2>
          <p>{selected?.text}</p>
          <h3>关注的领域</h3>
          <ul>
            {selected?.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="content-note">
            具体职位、工作地点、任职要求与申请方式待企业确认。目前仅提供人才交流入口。
          </p>
          <Button href="/contact/?type=career">介绍一下自己</Button>
        </div>
      </dialog>
    </>
  );
}
