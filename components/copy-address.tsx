"use client";
import { useState } from "react";
import { address } from "@/lib/content";
export function CopyAddress({ english: en = false }: { english?: boolean }) {
  const [state, setState] = useState("");
  return (
    <div className="copy-address">
      <button
        className="text-link"
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(address);
            setState(en ? "Address copied." : "地址已复制");
          } catch {
            setState(
              en
                ? "Select and copy the address above, or open the map."
                : "请长按上方地址复制，或打开地图查看路线。",
            );
          }
        }}
      >
        {en ? "Copy visiting address" : "复制来访地址"}
      </button>
      <p role="status">{state}</p>
    </div>
  );
}
