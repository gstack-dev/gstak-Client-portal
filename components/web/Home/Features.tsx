import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  GitBranch,
  FolderOpen,
  MessageSquare,
  Receipt,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Project Tracking",
    description:
      "Monitor milestones and task completion with granular precision and clear status indicators.",
  },
  {
    icon: FolderOpen,
    title: "File Sharing",
    description:
      "Secure, organized asset delivery with version control and instant client access.",
  },
  {
    icon: MessageSquare,
    title: "Team Communication",
    description:
      "Centralized threads that eliminate inbox clutter and keep context attached to specific tasks.",
  },
  {
    icon: Receipt,
    title: "Invoice Management",
    description:
      "Automated billing cycles integrated directly into the project timeline for seamless payments.",
  },
  {
    icon: RefreshCw,
    title: "Progress Updates",
    description:
      "Asynchronous status reports that give clients confidence without requiring daily meetings.",
  },
  {
    icon: LayoutDashboard,
    title: "Client Dashboard",
    description:
      "A white-labeled portal where your clients see exactly what they need, nothing more.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-[130px] px-4 md:px-12 max-w-[1280px] mx-auto py-16"
    >
      <div className="text-center max-w-[672px] mx-auto mb-8">
        <h2
          className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          Designed for Clarity & Execution
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          Everything you need to deliver premium agency services without the
          friction.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="group hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800"
          >
            <CardHeader>
              <div className="bg-slate-100 dark:bg-[#1E293B] text-slate-900 dark:text-slate-50 w-12 h-12 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:text-white dark:group-hover:text-white transition-colors">
                <feature.icon className="size-5" />
              </div>
              <CardTitle
                className="text-lg font-semibold text-slate-900 dark:text-slate-50"
                style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                {feature.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
