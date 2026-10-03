"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { phone, phoneHref } from "@/lib/content";
type Values = {
  name: string;
  company: string;
  contact: string;
  type: string;
  budget: string;
  message: string;
  consent: boolean;
};
const initial: Values = {
  name: "",
  company: "",
  contact: "",
  type: "项目咨询",
  budget: "暂未确定",
  message: "",
  consent: false,
};
export function ContactForm() {
  const [v, setV] = useState<Values>(initial);
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<
    "idle" | "loading" | "prepared" | "sent" | "error"
  >("idle");
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
  useEffect(() => {
    setReady(true);
    const type = new URLSearchParams(location.search).get("type");
    if (type === "partner") setV((x) => ({ ...x, type: "合作伙伴" }));
    if (type === "career") setV((x) => ({ ...x, type: "人才交流" }));
  }, []);
  function change(key: keyof Values, value: string | boolean) {
    setV((x) => ({ ...x, [key]: value }));
    setErrors((x) => ({ ...x, [key]: "" }));
    if (state !== "loading") setState("idle");
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!v.name.trim()) er.name = "请填写你的姓名";
    if (!v.company.trim())
      er.company = "请填写公司或团队名称（个人可填写“个人”）";
    if (
      !/^(?:[^\s@]+@[^\s@]+\.[^\s@]+|[+\d\s()-]{7,20})$/.test(v.contact.trim())
    )
      er.contact = "请填写有效邮箱或电话号码";
    if (v.message.trim().length < 10)
      er.message = "请至少用 10 个字介绍你的需求";
    if (!v.consent) er.consent = "请阅读并同意隐私说明";
    setErrors(er);
    if (Object.keys(er).length) {
      setTimeout(() => document.getElementById("error-summary")?.focus(), 0);
      return;
    }
    if (!endpoint) {
      setState("prepared");
      return;
    }
    setState("loading");
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        const r = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(v),
          signal: controller.signal,
        });
        if (!r.ok) throw Error("failed");
        setState("sent");
      } finally {
        clearTimeout(timer);
      }
    } catch {
      setState("error");
    }
  }
  function download() {
    const text = `合作需求\n\n姓名：${v.name}\n公司：${v.company}\n联系方式：${v.contact}\n需求类型：${v.type}\n项目预算：${v.budget}\n\n项目介绍：\n${v.message}\n\n此文件仅供本人保存，未发送至美创数字。`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "美创数字-合作需求.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  const field = (
    id: "name" | "company" | "contact",
    label: string,
    placeholder: string,
    auto: string,
  ) => (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        <span> *</span>
      </label>
      <input
        id={id}
        name={id}
        value={v[id]}
        autoComplete={auto}
        maxLength={150}
        placeholder={placeholder}
        required
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        onChange={(e) => change(id, e.target.value)}
      />
      {errors[id] && (
        <span id={`${id}-error`} className="field-error">
          {errors[id]}
        </span>
      )}
    </div>
  );
  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      {Object.values(errors).some(Boolean) && (
        <div
          id="error-summary"
          className="error-summary"
          role="alert"
          tabIndex={-1}
        >
          <h3>请检查以下内容</h3>
          <ul>
            {Object.entries(errors)
              .filter(([, text]) => text)
              .map(([key, text]) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(key)?.focus();
                    }}
                  >
                    {text}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}
      <div className="form-row">
        {field("name", "姓名", "如何称呼你", "name")}
        {field("company", "公司 / 团队", "公司名称或个人", "organization")}
      </div>
      {field("contact", "联系方式", "邮箱或电话号码", "email")}
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="type">需求类型 *</label>
          <select
            id="type"
            name="type"
            value={v.type}
            onChange={(e) => change("type", e.target.value)}
          >
            {["项目咨询", "商务合作", "合作伙伴", "人才交流"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="budget">
            项目预算 <small>（可选）</small>
          </label>
          <select
            id="budget"
            name="budget"
            value={v.budget}
            onChange={(e) => change("budget", e.target.value)}
          >
            {[
              "暂未确定",
              "5 万元以下",
              "5-20 万元",
              "20-50 万元",
              "50 万元以上",
              "希望先讨论",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="message">项目介绍 *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={v.message}
          maxLength={5000}
          placeholder="你希望解决什么问题？目前处于什么阶段？"
          onChange={(e) => change("message", e.target.value)}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        <div className="textarea-meta">
          {errors.message ? (
            <span id="message-error" className="field-error">
              {errors.message}
            </span>
          ) : (
            <span>可以从目标、需求或时间安排开始。</span>
          )}
          <span>{v.message.length} / 5000</span>
        </div>
      </div>
      <div className="consent-field">
        <label>
          <input
            id="consent"
            type="checkbox"
            checked={v.consent}
            onChange={(e) => change("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            我已阅读<Link href="/privacy/">隐私说明</Link>
            ，同意为回复本次需求使用上述信息。
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="field-error">
            {errors.consent}
          </p>
        )}
      </div>
      {!endpoint && (
        <p className="channel-note">
          你可以先整理并下载需求清单，或直接电话沟通。当前表单内容不会自动发送。
        </p>
      )}
      {!endpoint && (
        <a
          className="text-link official-contact"
          href="https://www.mgcdigi.com/contact#cooperate"
          target="_blank"
          rel="noreferrer"
        >
          在线提交合作需求 ↗
        </a>
      )}
      <button
        type="submit"
        className="button"
        disabled={state === "loading" || !ready}
      >
        {state === "loading"
          ? "正在发送…"
          : endpoint
            ? "发送合作需求"
            : "生成合作需求"}
        <span aria-hidden="true">↗</span>
      </button>
      <div aria-live="polite" aria-atomic="true">
        {state === "prepared" && (
          <div className="form-feedback">
            <strong>需求已整理，尚未发送。</strong>
            <p>下载清单后，可拨打商务电话交流需求，确认后续资料接收方式。</p>
            <button type="button" className="text-link" onClick={download}>
              下载需求文件 ↓
            </button>
            <a className="text-link form-phone" href={phoneHref}>
              商务咨询 {phone}
            </a>
          </div>
        )}
        {state === "sent" && (
          <div className="form-feedback">
            <strong>合作需求已发送。</strong>
            <p>感谢你的介绍，我们会通过你留下的联系方式与你沟通。</p>
          </div>
        )}
        {state === "error" && (
          <div className="form-feedback error" role="alert">
            <strong>暂时未能发送。</strong>
            <p>请稍后重试，或下载需求文件保存，避免丢失已填写内容。</p>
            <button type="button" className="text-link" onClick={download}>
              下载需求文件 ↓
            </button>
            <a className="text-link form-phone" href={phoneHref}>
              商务咨询 {phone}
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
