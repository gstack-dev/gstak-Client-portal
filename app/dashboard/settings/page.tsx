"use client";

import { useState, useEffect, useSyncExternalStore, useActionState, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/components/LanguageProvider";
import { locales, type Locale } from "@/lib/i18n";
import {
  User,
  Palette,
  Shield,
  Save,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { getProfile, logSession, getUserSessions, updateProfile, changePassword } from "@/app/actions/user";
import type { SessionEntry } from "@/app/actions/user";

const emptySubscribe = () => () => {};

function getDeviceInfo(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  const browsers = [
    { re: /Edg\//, name: "Edge" },
    { re: /Chrome\//, name: "Chrome" },
    { re: /Firefox\//, name: "Firefox" },
    { re: /Safari\//, name: "Safari" },
  ];
  const browser = browsers.find((b) => b.re.test(ua))?.name ?? "Unknown";
  const os = /Windows/.test(ua) ? "Windows" : /Mac/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : /iPhone/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : "Unknown";
  return `${browser} on ${os}`;
}

export default function SettingsPage() {
  useEffect(() => { document.title = "Settings | G-Stack"; }, []);
  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale, localeNames } = useTranslation();
  const tabs = [
    { id: "profile", label: t("settings.profileTab"), icon: User },
    { id: "appearance", label: t("settings.appearanceTab"), icon: Palette },
    { id: "security", label: t("settings.securityTab"), icon: Shield },
  ];
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<{ name: string; email: string; image: string | null; company?: string; phone?: string } | null>(null);
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [profileState, profileAction, profilePending] = useActionState(updateProfile, null);
  const [passwordState, passwordAction, passwordPending] = useActionState(changePassword, null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((data) => {
      if (data) setProfile(data);
    });
    getUserSessions().then(setSessions);
    logSession(getDeviceInfo());
  }, []);

  const TabIcon = tabs.find((t) => t.id === activeTab)!.icon;

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          {t("settings.title")}
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600/10 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-slate-50"
                }`}
              >
                <tab.icon className="size-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <Card className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/10 dark:bg-blue-600/10 flex items-center justify-center">
                  <TabIcon className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle
                    className="text-xl font-semibold text-slate-900 dark:text-slate-50"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
                  >
                    {tabs.find((t) => t.id === activeTab)!.label}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {activeTab === "profile" && t("settings.profileDesc")}
                    {activeTab === "appearance" && t("settings.appearanceDesc")}
                    {activeTab === "security" && t("settings.securityDesc")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              {activeTab === "profile" && (
                <form key={profile?.name ?? "loading"} action={profileAction} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 group cursor-pointer" onClick={() => fileRef.current?.click()}>
                      <div className="w-full h-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center text-3xl font-semibold text-blue-600 dark:text-blue-400">
                        {preview ? <img src={preview} alt="Avatar" className="w-full h-full object-cover" /> : profile?.image ? <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" /> : profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera className="size-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{t("settings.clientAvatar")}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("settings.avatarHint")}</p>
                      <input ref={fileRef} name="image" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }} />
                      <Button variant="outline" size="sm" className="mt-2" type="button" onClick={() => fileRef.current?.click()}>{t("settings.uploadPhoto")}</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("settings.fullName")}</label>
                      <Input name="name" defaultValue={profile?.name ?? ""} className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("settings.emailAddress")}</label>
                      <Input defaultValue={profile?.email ?? ""} disabled className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B] opacity-60" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("settings.company")}</label>
                      <Input name="company" defaultValue={profile?.company ?? ""} className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("settings.phone")}</label>
                      <Input name="phone" defaultValue={profile?.phone ?? ""} className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={profilePending}><Save className="size-4 mr-1" /> Save Changes</Button>
                    {profileState?.success && <span className="text-xs text-green-600 dark:text-green-400 ml-2 self-center">Saved!</span>}
                  </div>
                </form>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  {!isClient ? (
                    <div className="h-32" />
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">Theme</h3>
                        <div className="flex gap-3">
                          {[
                            { value: "light", icon: Sun, label: "Light" },
                            { value: "dark", icon: Moon, label: "Dark" },
                            { value: "system", icon: Laptop, label: "System" },
                          ].map((t) => (
                            <button key={t.value} onClick={() => setTheme(t.value)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                                theme === t.value
                                  ? "border-blue-600 dark:border-blue-400 bg-blue-600/10 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400"
                                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                              }`}
                            >
                              <t.icon className="size-4" /> {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">Language</h3>
                        <select
                          value={locale}
                          onChange={(e) => setLocale(e.target.value as Locale)}
                          className="w-full md:w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
                        >
                          {locales.map((l) => (
                            <option key={l} value={l}>{localeNames[l]}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <Button><Save className="size-4 mr-1" /> Save Preferences</Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <form action={passwordAction} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Password</label>
                      <Input name="currentPassword" type="password" placeholder="Enter current password" className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Password</label>
                      <Input name="newPassword" type="password" placeholder="Enter new password" className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Confirm New Password</label>
                      <Input name="confirmPassword" type="password" placeholder="Confirm new password" className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                  </div>
                  {passwordState?.error && <p className="text-sm text-red-600 dark:text-red-400">{passwordState.error}</p>}
                  {passwordState?.success && <p className="text-sm text-green-600 dark:text-green-400">Password updated successfully.</p>}
                  <div className="flex justify-end">
                    <Button type="submit" disabled={passwordPending}><Save className="size-4 mr-1" /> Update Password</Button>
                  </div>
                  </form>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">Active Sessions</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Manage your active login sessions across devices.</p>
                    <div className="space-y-2">
                      {sessions.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No session data yet.</p>
                      ) : sessions.map((s, i) => (
                        <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <Laptop className="size-4 text-slate-500 dark:text-slate-400" />
                            <div>
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{s.device}</span>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{s.time}</p>
                            </div>
                          </div>
                          {i === 0 ? (
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Active</span>
                          ) : (
                            <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Revoke</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Camera({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
