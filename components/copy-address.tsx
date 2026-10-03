"use client";
import { useState } from "react";
import { address } from "@/lib/content";
export function CopyAddress() {
  const [state, setState] = useState("");
  return (
    <div className="copy-address">
      <button
        className="text-link"
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(address);
            setState("地址已复制");
          } catch {
            setState("请长按上方地址复制，或打开地图查看路线。");
          }
        }}
      >
        复制来访地址
      </button>
      <p role="status">{state}</p>
    </div>
  );
}
