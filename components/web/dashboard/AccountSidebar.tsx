"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { getProfile, updateProfile } from "@/app/actions/user";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, LogOut } from "lucide-react";

export default function AccountPopup({
  isOpen,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (data: { name?: string; image?: string | null }) => void;
}) {
  const [user, setUser] = useState<{
    name: string;
    image: string | null;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, action, isPending] = useActionState(updateProfile, null);
  const popupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      getProfile().then((p) => {
        if (p) {
          setUser({ name: p.name || "", image: p.image || null });
          setPreviewUrl(p.image || null);
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (state?.success) {
      onSaved?.(state);
      onClose();
    }
  }, [state, onClose, onSaved]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      )
        onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div
      ref={popupRef}
      className="absolute top-20 right-8 w-80 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-6 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-md"
    >
      <h2
        className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4"
        style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
      >
        Account
      </h2>

      <form action={action} className="flex flex-col gap-2">
        <div className="flex flex-col items-center mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full mb-2 cursor-pointer group overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 transition-all shadow-md"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt="Profile"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center text-4xl text-blue-600 dark:text-blue-400 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera className="size-6" />
              <span className="text-[10px] font-medium mt-0.5">Upload</span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline hover:bg-transparent"
          >
            Change Photo
          </Button>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">
            Name
          </span>
          <Input
            name="name"
            defaultValue={user.name}
            className="w-full dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white transition-all font-medium py-2 rounded-lg"
        >
          {isPending ? "Updating..." : "Save Changes"}
        </Button>
      </form>

      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full justify-start gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
