"use client";

import { useEffect } from "react";
import './toast.css'

type ToastProps = {
  visible: boolean;
  type: "success" | "error";
  message: string;
  onClose?: () => void;
};

export default function Toast({ visible, type, message, onClose }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onClose && onClose(), 4000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={`ag-toast ${type}`} role="status" aria-live="polite">
      <div className="ag-toast-inner">{message}</div>
    </div>
  );
}
