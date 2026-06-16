import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const adminEmail = siteConfig.adminEmail || "hello@g-stack.com";

const getMailtoLink = (planName: string) => {
  const subject = encodeURIComponent(`StartProject - ${planName}`);
  const body = encodeURIComponent(
    `Hi G-Stack Team,\n\nI am interested in starting the ${planName} plan with you.\n\nName: \nEmail: \nProject Description: `
  );
  return `mailto:${adminEmail}?subject=${subject}&body=${body}`;
};

const plans = [
  {
    name: "Starter",
    description: "For freelancers and individuals",
    price: "$9",
    features: ["1 Active Client", "Project Tracking", "File Sharing", "Client Messaging"],
  },
  {
    name: "Professional",
    description: "For growing businesses",
    price: "$29",
    popular: true,
    features: [
      "10 Active Clients",
      "Progress Reports",
      "Project Milestones",
      "File Management",
      "Notifications",
    ],
  },
  {
    name: "Agency",
    description: "For scaling agencies",
    price: "$79",
    features: [
      "Unlimited Clients",
      "Team Members",
      "Analytics Dashboard",
      "White Label",
      "Priority Support",
    ],
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-[130px] px-4 md:px-12 max-w-[1280px] mx-auto py-16"
    >
      <div className="text-center max-w-[672px] mx-auto mb-8">
        <h2
          className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
        >
          Simple, Transparent Pricing
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          Choose the plan that best fits your agency&apos;s growth stage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col relative bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 overflow-visible ${
              plan.popular ? "ring-2 ring-blue-600 dark:ring-blue-400 shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle
                className="text-lg font-semibold text-slate-900 dark:text-slate-50"
                style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                {plan.name}
              </CardTitle>
              {plan.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {plan.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-slate-900 dark:text-slate-50">
                  {plan.price}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-base">/month</span>
              </div>
              <Separator />
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                  >
                    <Check className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link
                href={getMailtoLink(plan.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  Get Started
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
