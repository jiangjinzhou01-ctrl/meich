"use client";
import { useEffect, useId, useRef, useState } from "react";
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
const kinds = ["项目咨询", "商务合作", "合作伙伴", "人才交流"];
const kindEn = [
  "Project enquiry",
  "Business collaboration",
  "Partnership",
  "Careers",
];
const budgets = [
  "暂未确定",
  "5 万元以下",
  "5-20 万元",
  "20-50 万元",
  "50 万元以上",
  "希望先讨论",
];
const budgetEn = [
  "Not yet defined",
  "Below CNY 50,000",
  "CNY 50,000–200,000",
  "CNY 200,000–500,000",
  "Above CNY 500,000",
  "Let's discuss",
];
export function ContactForm({ english: en = false }: { english?: boolean }) {
  const t = (zh: string, english: string) => (en ? english : zh);
  const [v, setV] = useState<Values>(initial);
  const [ready, setReady] = useState(false);
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<
    "idle" | "loading" | "prepared" | "sent" | "error"
  >("idle");
  const [copyState, setCopyState] = useState("");
  const summary = useRef<HTMLDivElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  const request = useRef<AbortController | null>(null);
  const id = useId();
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
  const busy = state === "loading";
  useEffect(() => {
    setReady(true);
    const type = new URLSearchParams(location.search).get("type");
    if (type === "partner") setV((x) => ({ ...x, type: "合作伙伴" }));
    if (type === "career") setV((x) => ({ ...x, type: "人才交流" }));
    return () => {
      const pending = request.current;
      request.current = null;
      pending?.abort();
    };
  }, []);
  useEffect(() => {
    if (validationAttempt) summary.current?.focus();
  }, [validationAttempt]);
  useEffect(() => {
    if (["prepared", "sent", "error"].includes(state))
      feedback.current?.focus();
  }, [state]);
  function change(key: keyof Values, value: string | boolean) {
    if (sending.current) return;
    setV((x) => ({ ...x, [key]: value }));
    setErrors((x) => ({ ...x, [key]: "" }));
    setState("idle");
    setCopyState("");
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending.current) return;
    const er: Record<string, string> = {};
    if (!v.name.trim()) er.name = t("请填写你的姓名", "Enter your name.");
    if (!v.company.trim())
      er.company = t(
        "请填写公司或团队名称（个人可填写“个人”）",
        "Enter your organisation, or ‘Individual’.",
      );
    if (
      !/^(?:[^\s@]+@[^\s@]+\.[^\s@]+|[+\d\s()-]{7,20})$/.test(v.contact.trim())
    )
      er.contact = t(
        "请填写有效邮箱或电话号码",
        "Enter a valid email address or telephone number.",
      );
    if (v.message.trim().length < 10)
      er.message = t(
        "请至少用 10 个字介绍你的需求",
        "Describe your enquiry in at least 10 characters.",
      );
    if (!v.consent)
      er.consent = t(
        "请阅读并同意隐私说明",
        "Read and agree to the privacy notice.",
      );
    setErrors(er);
    if (Object.keys(er).length) {
      setValidationAttempt((x) => x + 1);
      return;
    }
    if (!endpoint) {
      setState("prepared");
      return;
    }
    sending.current = true;
    setState("loading");
    const controller = new AbortController();
    request.current = controller;
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
        signal: controller.signal,
      });
      if (!response.ok) throw Error("Request rejected");
      setState("sent");
    } catch {
      if (request.current === controller) setState("error");
    } finally {
      clearTimeout(timer);
      sending.current = false;
      request.current = null;
    }
  }
  function brief() {
    return (
      t("合作需求", "Collaboration brief") +
      `\n\n${t("姓名", "Name")}: ${v.name}\n${t("公司", "Organisation")}: ${v.company}\n${t("联系方式", "Contact")}: ${v.contact}\n${t("需求类型", "Enquiry")}: ${en ? kindEn[kinds.indexOf(v.type)] : v.type}\n${t("项目预算", "Budget")}: ${en ? budgetEn[budgets.indexOf(v.budget)] : v.budget}\n\n${v.message}\n\n` +
      t(
        "此文件仅为本地副本。复制或下载不会将需求发送至美创数字。",
        "This is a local copy. Copying or downloading does not send the enquiry to MGC.",
      )
    );
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([brief()], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "MGC-collaboration-brief.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(brief());
      setCopyState(
        t("需求已复制，未因此发送。", "Brief copied. This does not send it."),
      );
    } catch {
      setCopyState(
        t(
          "无法访问剪贴板，请下载需求文件。",
          "Clipboard unavailable. Please download the brief.",
        ),
      );
    }
  }
  const field = (
    key: "name" | "company" | "contact",
    label: string,
    placeholder: string,
    auto: string,
  ) => (
    <div className="form-field">
      <label htmlFor={key}>
        {label}
        <span> *</span>
      </label>
      <input
        id={key}
        name={key}
        value={v[key]}
        autoComplete={auto}
        autoCapitalize={key === "contact" ? "none" : undefined}
        spellCheck={key !== "contact"}
        maxLength={150}
        placeholder={placeholder}
        required
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        onChange={(e) => change(key, e.target.value)}
      />
      {errors[key] && (
        <span id={`${key}-error`} className="field-error">
          {errors[key]}
        </span>
      )}
    </div>
  );
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      noValidate
      aria-busy={busy}
    >
      <div className="form-mode">
        <span>
          {endpoint
            ? t("在线提交", "Online enquiry")
            : t("本地整理", "Prepare locally")}
        </span>
        <p>
          {endpoint
            ? t(
                "通过企业配置的接口提交需求。",
                "Send through the configured company endpoint.",
              )
            : t(
                "先整理想法，再选择沟通方式。内容不会自动发送。",
                "Prepare your ideas, then choose how to connect. Nothing is sent automatically.",
              )}
        </p>
      </div>
      {Object.values(errors).some(Boolean) && (
        <div ref={summary} className="error-summary" role="alert" tabIndex={-1}>
          <h3>{t("请检查以下内容", "Please check your details")}</h3>
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
      <fieldset disabled={busy} className="contact-fields">
        <legend className="sr-only">
          {t("合作需求", "Collaboration enquiry")}
        </legend>
        <div className="form-row">
          {field(
            "name",
            t("姓名", "Name"),
            t("如何称呼你", "Your name"),
            "name",
          )}
          {field(
            "company",
            t("公司 / 团队", "Organisation"),
            t("公司名称或个人", "Organisation or individual"),
            "organization",
          )}
        </div>
        {field(
          "contact",
          t("联系方式", "Contact"),
          t("邮箱或电话号码", "Email or telephone"),
          "email",
        )}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="type">{t("需求类型", "Enquiry type")} *</label>
            <select
              id="type"
              name="type"
              value={v.type}
              onChange={(e) => change("type", e.target.value)}
            >
              {kinds.map((x, i) => (
                <option key={x} value={x}>
                  {en ? kindEn[i] : x}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="budget">
              {t("项目预算（可选）", "Budget (optional)")}
            </label>
            <select
              id="budget"
              name="budget"
              value={v.budget}
              onChange={(e) => change("budget", e.target.value)}
            >
              {budgets.map((x, i) => (
                <option key={x} value={x}>
                  {en ? budgetEn[i] : x}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="message">
            {t("项目介绍", "About your project")} *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={v.message}
            maxLength={5000}
            placeholder={t(
              "你希望解决什么问题？目前处于什么阶段？",
              "What would you like to achieve? What stage are you at?",
            )}
            onChange={(e) => change("message", e.target.value)}
            required
            aria-invalid={!!errors.message}
            aria-describedby={
              errors.message ? "message-error" : id + "-message-help"
            }
          />
          <div className="textarea-meta">
            {errors.message ? (
              <span id="message-error" className="field-error">
                {errors.message}
              </span>
            ) : (
              <span id={id + "-message-help"}>
                {t(
                  "可以从目标、需求或时间安排开始。",
                  "Start with goals, requirements or timing.",
                )}
              </span>
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
              {t("我已阅读", "I have read the ")}
              <Link href={en ? "/en/privacy/" : "/privacy/"}>
                {t("隐私说明", "privacy notice")}
              </Link>
              {t(
                "，同意为回复本次需求使用上述信息。",
                " and agree to use of these details to respond to this enquiry.",
              )}
            </span>
          </label>
          {errors.consent && (
            <p id="consent-error" className="field-error">
              {errors.consent}
            </p>
          )}
        </div>
        <button type="submit" className="button" disabled={!ready}>
          {busy
            ? t("正在发送…", "Sending…")
            : endpoint
              ? t("发送合作需求", "Send enquiry")
              : t("整理合作需求", "Prepare brief")}
          <span aria-hidden="true">↗</span>
        </button>
      </fieldset>
      {!endpoint && (
        <a
          className="text-link official-contact"
          href="https://www.mgcdigi.com/contact#cooperate"
          target="_blank"
          rel="noreferrer"
        >
          {t("前往企业原站联系渠道 ↗", "Contact MGC on the original website ↗")}
        </a>
      )}
      {state !== "idle" && state !== "loading" && (
        <div
          ref={feedback}
          tabIndex={-1}
          className={"form-feedback " + (state === "error" ? "error" : "")}
          role="status"
        >
          <strong>
            {state === "prepared"
              ? t(
                  "需求已整理，尚未发送。",
                  "Brief prepared. It has not been sent.",
                )
              : state === "sent"
                ? t(
                    "收件接口已接收需求。",
                    "The enquiry endpoint has accepted your request.",
                  )
                : t("暂时未能确认送达。", "Delivery could not be confirmed.")}
          </strong>
          <p>
            {state === "prepared"
              ? t(
                  "复制或下载后，可致电确认资料接收方式。离开页面不会保留填写内容。",
                  "Copy or download your brief, then call to arrange delivery. Your details are not retained after leaving this page.",
                )
              : state === "sent"
                ? t(
                    "如需确认后续安排，可通过商务电话联系。",
                    "Call our business number to confirm next steps.",
                  )
                : t(
                    "请保留需求副本，重试前可致电确认，避免重复提交。",
                    "Keep a copy and call to confirm before retrying, to avoid duplicate enquiries.",
                  )}
          </p>
          <div className="brief-actions">
            <button type="button" className="text-link" onClick={copy}>
              {t("复制需求", "Copy brief")}
            </button>
            <button type="button" className="text-link" onClick={download}>
              {t("下载需求文件 ↓", "Download brief ↓")}
            </button>
          </div>
          <p aria-live="polite">{copyState}</p>
          <a className="text-link form-phone" href={phoneHref}>
            {t("商务咨询", "Business enquiries")} {phone}
          </a>
        </div>
      )}
    </form>
  );
}
