import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BottomSheetSelectorProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
  hint?: string;
  sheetTitle?: string;
  searchPlaceholder?: string;
}

export default function BottomSheetSelector({
  label,
  value,
  onChange,
  options,
  disabled = false,
  hint,
  sheetTitle,
  searchPlaceholder,
}: BottomSheetSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filled = value !== "";

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const showSearch = options.length > 8;

  return (
    <>
      {/* Trigger field */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(true)}
        className={`relative w-full text-left bg-white border rounded-[8px] px-[16px] pt-[26px] pb-[10px] font-['Effra',sans-serif] text-[14px] outline-none transition-all ${disabled ? "opacity-50 cursor-not-allowed border-[#E2E8F0]" : "cursor-pointer border-[#E2E8F0] active:border-[#003883]"}`}
      >
        <span className={`absolute left-[16px] font-['Effra',sans-serif] pointer-events-none transition-all ${filled ? "top-[10px] text-[10px] text-[#64748B]" : "top-1/2 -translate-y-1/2 text-[14px] text-[#64748B]"}`}>
          {label}
        </span>
        <span className={filled ? "text-[#1E293B]" : "text-transparent"}>
          {value || "\u00A0"}
        </span>
        <svg
          className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {hint && <div className="mt-[6px] font-['Effra',sans-serif] text-[11px] text-[#94A3B8]">{hint}</div>}

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-[480px] bg-white rounded-t-[20px] flex flex-col max-h-[75vh]"
            >
              {/* Handle */}
              <div className="flex justify-center pt-[10px] pb-[4px]">
                <div className="w-[36px] h-[4px] rounded-full bg-[#e2e5ea]" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-[20px] py-[12px] border-b border-[#f0f0f0]">
                <h3 className="font-['Effra',sans-serif] font-bold text-[17px] text-[#383838]">
                  {sheetTitle || label}
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-[32px] h-[32px] rounded-full hover:bg-[#f4f6f8] flex items-center justify-center transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#383838" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Search */}
              {showSearch && (
                <div className="px-[20px] pt-[12px] pb-[8px]">
                  <div className="relative">
                    <svg className="absolute left-[12px] top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="#94A3B8" strokeWidth="2" />
                      <path d="M20 20l-3.5-3.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={searchPlaceholder || `Search ${label.toLowerCase()}…`}
                      className="w-full bg-[#f4f6f8] rounded-[10px] pl-[36px] pr-[14px] py-[11px] font-['Effra',sans-serif] text-[14px] text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#003883]/20 transition-shadow"
                    />
                    {query && (
                      <button onClick={() => setQuery("")} className="absolute right-[10px] top-1/2 -translate-y-1/2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="#d1d5db" />
                          <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Options list */}
              <div ref={listRef} className="flex-1 overflow-y-auto px-[12px] py-[4px] overscroll-contain">
                {filtered.length === 0 ? (
                  <div className="py-[32px] text-center">
                    <p className="font-['Effra',sans-serif] text-[14px] text-[#94A3B8]">No results found</p>
                  </div>
                ) : (
                  filtered.map((opt) => {
                    const selected = opt === value;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => select(opt)}
                        className={`w-full flex items-center justify-between px-[16px] py-[14px] rounded-[12px] transition-colors ${selected ? "bg-[#ebf3ff]" : "hover:bg-[#f4f6f8] active:bg-[#eef1f5]"}`}
                      >
                        <span className={`font-['Effra',sans-serif] text-[14px] ${selected ? "font-bold text-[#003883]" : "text-[#26282b]"}`}>
                          {opt}
                        </span>
                        {selected && (
                          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#003883" />
                            <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
