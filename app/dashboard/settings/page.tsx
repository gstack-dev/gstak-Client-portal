"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  User,
  Bell,
  Palette,
  FolderKanban,
  Shield,
  Save,
  Globe,
  Eye,
  MessageSquare,
  FileUp,
  Clock,
  Sun,
  Moon,
  Laptop,
  Flag,
} from "lucide-react";
import { settingsProjects, notificationPrefs, activeSessions } from "@/lib/data";

const emptySubscribe = () => () => {};

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationPrefs.map((p) => [p.key, true]))
  );
  const [projectNotifs, setProjectNotifs] = useState<Record<number, boolean>>(
    Object.fromEntries(settingsProjects.map((p) => [p.id, true]))
  );
  const [projectStatus, setProjectStatus] = useState<Record<number, "active" | "closed">>(
    Object.fromEntries(settingsProjects.map((p) => [p.id, "active"]))
  );
  const [projectPriority, setProjectPriority] = useState<Record<number, "high" | "medium" | "low">>(
    Object.fromEntries(settingsProjects.map((p) => [p.id, "medium"]))
  );
  const [defaultView, setDefaultView] = useState<"grid" | "list">("grid");

  const TabIcon = tabs.find((t) => t.id === activeTab)!.icon;

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          Settings
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
          Manage your account, project preferences, and notifications.
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
                    {activeTab === "profile" && "Update your personal information and avatar."}
                    {activeTab === "projects" && "Configure how your projects behave and appear."}
                    {activeTab === "notifications" && "Choose what updates you receive and how."}
                    {activeTab === "appearance" && "Customize the look and feel of your portal."}
                    {activeTab === "security" && "Manage your password and account security."}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 group cursor-pointer">
                      <div className="w-full h-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center text-3xl font-semibold text-blue-600 dark:text-blue-400">G</div>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera className="size-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50">Client Avatar</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                      <Button variant="outline" size="sm" className="mt-2">Upload Photo</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                      <Input defaultValue="George G." className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                      <Input defaultValue="george.gstack@gmail.com" className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Company</label>
                      <Input defaultValue="Acme Corp" className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Phone</label>
                      <Input defaultValue="+1 (555) 123-4567" className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button><Save className="size-4 mr-1" /> Save Changes</Button>
                  </div>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">Default View</h3>
                    <div className="flex gap-3">
                      {(["grid", "list"] as const).map((view) => (
                        <button
                          key={view}
                          onClick={() => setDefaultView(view)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                            defaultView === view
                              ? "border-blue-600 dark:border-blue-400 bg-blue-600/10 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400"
                              : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          {view === "grid" ? <Eye className="size-4" /> : <ListIcon className="size-4" />}
                          {view === "grid" ? "Grid View" : "List View"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">Project Status</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Close projects that are no longer active.</p>
                    <div className="space-y-2">
                      {settingsProjects.map((project) => {
                        const status = projectStatus[project.id];
                        const isClosed = status === "closed";
                        return (
                          <div key={project.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isClosed ? "border-slate-100 dark:border-slate-800 opacity-60" : "border-slate-200 dark:border-slate-700"}`}>
                            <div className="flex items-center gap-3">
                              <FolderKanban className={`size-4 ${isClosed ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`} />
                              <div>
                                <span className={`text-sm font-medium ${isClosed ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-900 dark:text-slate-50"}`}>{project.name}</span>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{project.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isClosed ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"}`}>
                                {isClosed ? "Closed" : "Active"}
                              </span>
                              <Button variant={isClosed ? "outline" : "ghost"} size="sm"
                                onClick={() => setProjectStatus((prev) => ({ ...prev, [project.id]: isClosed ? "active" : "closed" }))}
                                className={isClosed ? "text-xs" : "text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"}
                              >
                                {isClosed ? "Reopen" : "Close"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">View Priority</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Set importance level for each project.</p>
                    <div className="space-y-2">
                      {settingsProjects.map((project) => {
                        const priority = projectPriority[project.id];
                        const isClosed = projectStatus[project.id] === "closed";
                        return (
                          <div key={project.id} className={`flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-all ${isClosed ? "opacity-50" : ""}`}>
                            <div className="flex items-center gap-3">
                              <Flag className={`size-4 ${priority === "high" ? "text-red-500" : priority === "medium" ? "text-blue-500" : "text-slate-400"}`} />
                              <span className={`text-sm font-medium ${isClosed ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-50"}`}>{project.name}</span>
                            </div>
                            <div className="flex gap-1">
                              {(["high", "medium", "low"] as const).map((level) => (
                                <button key={level} disabled={isClosed}
                                  onClick={() => setProjectPriority((prev) => ({ ...prev, [project.id]: level }))}
                                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                                    priority === level
                                      ? level === "high" ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                        : level === "medium" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                        : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                      : "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"
                                  }`}
                                >
                                  {level.charAt(0).toUpperCase() + level.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">Project Notifications</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Enable or disable notifications per project.</p>
                    <div className="space-y-2">
                      {settingsProjects.map((project) => {
                        const isClosed = projectStatus[project.id] === "closed";
                        return (
                          <label key={project.id} className={`flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer ${isClosed ? "opacity-50 pointer-events-none" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                            <div className="flex items-center gap-3">
                              <FolderKanban className="size-4 text-slate-500 dark:text-slate-400" />
                              <div>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{project.name}</span>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{project.role}</p>
                              </div>
                            </div>
                            <input type="checkbox" checked={projectNotifs[project.id]}
                              onChange={() => setProjectNotifs((prev) => ({ ...prev, [project.id]: !prev[project.id] }))}
                              className="rounded border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:bg-[#1E293B]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button><Save className="size-4 mr-1" /> Save Preferences</Button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    {notificationPrefs.map((pref) => {
                      const PrefIcon = pref.icon === "Globe" ? Globe : pref.icon === "FileUp" ? FileUp : pref.icon === "MessageSquare" ? MessageSquare : pref.icon === "Eye" ? Eye : Clock;
                      return (
                        <label key={pref.key} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <PrefIcon className="size-4 text-slate-500 dark:text-slate-400 shrink-0" />
                            <div>
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{pref.label}</span>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{pref.desc}</p>
                            </div>
                          </div>
                          <input type="checkbox" checked={notifications[pref.key]}
                            onChange={() => setNotifications((prev) => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                            className="rounded border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:bg-[#1E293B]"
                          />
                        </label>
                      );
                    })}
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">Email Digest Frequency</h3>
                    <select className="w-full md:w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Never</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <Button><Save className="size-4 mr-1" /> Save Preferences</Button>
                  </div>
                </div>
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
                        <select className="w-full md:w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none">
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Password</label>
                      <Input type="password" placeholder="Enter current password" className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Password</label>
                      <Input type="password" placeholder="Enter new password" className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Confirm New Password</label>
                      <Input type="password" placeholder="Confirm new password" className="border-slate-200 dark:border-slate-700 dark:bg-[#1E293B]" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button><Save className="size-4 mr-1" /> Update Password</Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">Active Sessions</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Manage your active login sessions across devices.</p>
                    <div className="space-y-2">
                      {activeSessions.map((session) => (
                        <div key={session.device} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <Laptop className="size-4 text-slate-500 dark:text-slate-400" />
                            <div>
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{session.device}</span>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{session.time}</p>
                            </div>
                          </div>
                          {session.active ? (
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
