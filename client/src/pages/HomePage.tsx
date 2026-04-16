import SundialCockpit from "@/components/SundialCockpit";
import StateCards from "@/components/StateCards";
import WhatAdvanced from "@/components/WhatAdvanced";
import LoopPulse from "@/components/LoopPulse";
import ToolCards from "@/components/ToolCards";
import LoopSensitivity from "@/components/LoopSensitivity";
import ActivityLog from "@/components/ActivityLog";
import Footer from "@/components/Footer";

interface Props {
  userId?: number;
}

export default function HomePage({ userId }: Props) {
  return (
    <main className="max-w-4xl mx-auto px-4 pb-20">
      {/* Hero headline */}
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mt-6 mb-2 leading-tight">
        Where reflection<br />becomes structure.
      </h1>

      {/* Sundial / Solar Cockpit */}
      <SundialCockpit />

      {/* Current State KPIs */}
      <StateCards />

      {/* What Advanced */}
      <WhatAdvanced />

      {/* Loop Pulse */}
      <LoopPulse />

      {/* Tool Cards + Architecture */}
      <ToolCards />

      {/* Bottom row: Sensitivity + Activity Log */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
        <LoopSensitivity userId={userId} />
        <ActivityLog />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
