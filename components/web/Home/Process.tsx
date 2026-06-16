const steps = [
  { number: "01", title: "Discovery Call", description: "We discuss goals, requirements, and project scope." },
  { number: "02", title: "Design & Planning", description: "Wireframes, structure, and project roadmap are approved." },
  { number: "03", title: "Development", description: "Weekly progress updates and transparent project tracking." },
  { number: "04", title: "Delivery", description: "Project delivery, deployment, and post-launch support." },
];

export default function Process() {
  return (
    <section className="px-4 md:px-12 max-w-[1280px] mx-auto py-16">
      <h2
        className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-8 text-center"
        style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
      >
        A Streamlined Workflow
      </h2>
      <div className="flex flex-col md:flex-row gap-6 justify-between relative">
        <div className="hidden md:block absolute top-6 left-12 right-12 h-[2px] bg-slate-200 dark:bg-slate-800 -z-10" />

        {steps.map((step) => (
          <div key={step.number} className="flex-1 flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0F172A] border-2 border-blue-600 dark:border-blue-400 flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400 z-10">
              {step.number}
            </div>
            <h4
              className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-2"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              {step.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
