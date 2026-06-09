import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const heroRef    = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);
  const formRef    = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        heroRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9 }
      )
      .fromTo(
        dividerRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.7 },
        "-=0.4"
      )
      .fromTo(
        infoRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3"
      )
      .fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(error => {
        if (error.path[0]) fieldErrors[error.path[0].toString()] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("https://formspree.io/f/xrevkekl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({ title: "Message sent!", description: "Thank you for reaching out. I'll get back to you soon." });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({ title: "Something went wrong.", description: "Please try again or email me directly.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error.", description: "Please check your connection and try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      <main className="container mx-auto px-6">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div ref={heroRef} className="pt-36 pb-12">
<h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.0] tracking-tight">
            Let's build<br />
            something <span className="text-primary">together.</span>
          </h1>
        </div>

        {/* ── Full-width divider ────────────────────────────────── */}
        <div ref={dividerRef} className="h-px bg-border w-full mb-16" />

        {/* ── Two-column layout ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 pb-32">

          {/* Left — contact info */}
          <div ref={infoRef} className="flex flex-col gap-8">

            <div className="space-y-2">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                Open to freelance projects, full-time roles, and creative collaborations.
                Drop a line — I read everything.
              </p>
            </div>

            <div className="space-y-6">

              {/* Email */}
              <a
                href="mailto:omtiwari.pune@gmail.com"
                className="flex items-center gap-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 640 640" fill="currentColor">
                    <path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Email</p>
                  <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    omtiwari.pune@gmail.com
                  </span>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/om-tiwari-6b100627b"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 640 640" fill="currentColor">
                    <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM165 266.2L231.5 266.2L231.5 480L165 480L165 266.2zM236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160C219.5 160 236.7 177.2 236.7 198.5zM413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480L413.9 480z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">LinkedIn</p>
                  <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    Om_tiwari
                  </span>
                </div>
              </a>

              {/* Behance */}
              <a
                href="https://www.behance.net/omtiwari2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 640 640" fill="currentColor">
                    <path d="M251.3 382.4C268.5 382.4 282.5 376.3 282.5 357C282.5 337.3 270.8 329.6 252.2 329.5L206.2 329.5L206.2 382.4L251.3 382.4zM245.9 252.8L206.3 252.8L206.3 297.6L249 297.6C264.1 297.6 274.8 291 274.8 274.7C274.8 257 261.1 252.8 245.9 252.8zM375.4 327.6L437.6 327.6C435.9 309.1 426.3 297.9 407.1 297.9C388.8 297.9 376.6 309.3 375.4 327.6zM480 96L160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96zM445.5 249L367.7 249L367.7 230.1L445.5 230.1L445.5 249zM289.7 307.7C313.3 314.4 324.7 335.2 324.7 359.3C324.7 398.3 292 415 257.1 415.2L164 415.2L164 223.2L254.5 223.2C287.4 223.2 315.9 232.5 315.9 270.7C315.9 290 306.9 299.5 289.7 307.7zM408.4 269.1C451.9 269.1 476 303.4 476 344.5C476 346.1 475.9 347.8 475.8 349.5C475.8 350.3 475.7 351 475.7 351.7L375.5 351.7C375.5 373.9 387.2 387 409.6 387C421.2 387 436.1 380.8 439.8 368.9L473.5 368.9C463.1 400.8 441.6 415.7 408.4 415.7C364.6 415.7 337.3 386 337.3 342.7C337.3 300.9 366 269.1 408.4 269.1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Behance</p>
                  <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    omtiwari2
                  </span>
                </div>
              </a>

              {/* Location */}
              <a
                href="https://maps.app.goo.gl/XMTkrxFLfeXbeyybA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 640 640" fill="currentColor">
                    <path d="M320 32C235.8 32 168 99.8 168 184C168 289.3 304 456 320 456C336 456 472 289.3 472 184C472 99.8 404.2 32 320 32zM320 240C288.7 240 264 215.3 264 184C264 152.7 288.7 128 320 128C351.3 128 376 152.7 376 184C376 215.3 351.3 240 320 240zM96 496L96 528C96 537.6 99.8 546.8 106.6 553.4C113.2 560.2 122.4 564 132 564L508 564C517.6 564 526.8 560.2 533.4 553.4C540.2 546.8 544 537.6 544 528L544 496C544 478.4 532.1 463.1 515.1 458.7L416 432C400.1 445.3 381.5 456 360 456L280 456C258.5 456 239.9 445.3 224 432L124.9 458.7C107.9 463.1 96 478.4 96 496z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Location</p>
                  <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    Pimpri, Pune
                  </span>
                </div>
              </a>
            </div>

            {/* Resume download — mt-auto pushes it to align with Send message button */}
            <Button
              variant="outline"
              className="mt-2 self-start rounded-full px-7 py-5 text-sm gap-2 border-foreground/20 hover:border-foreground transition-colors"
              asChild
            >
              <a href="/Om_Tiwari_Resume.pdf" download="Om_Tiwari_Resume.pdf">
                Download Resume
                <Download className="h-4 w-4" />
              </a>
            </Button>

          </div>

          {/* Right — contact form */}
          <div ref={formRef} className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Got a project?<br />
                <span className="text-primary">Let's talk.</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-13 rounded-2xl text-base border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
                {errors.name && <p className="text-destructive text-sm mt-1.5">{errors.name}</p>}
              </div>

              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-13 rounded-2xl text-base border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
                {errors.email && <p className="text-destructive text-sm mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <Textarea
                  name="message"
                  placeholder="Tell me about your project — what you're building, what you need, timeline..."
                  value={formData.message}
                  onChange={handleChange}
                  className="min-h-[180px] rounded-2xl text-base resize-none border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
                {errors.message && <p className="text-destructive text-sm mt-1.5">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="rounded-full px-8 py-5 text-sm gap-2 bg-foreground text-background hover:bg-foreground/80 transition-colors disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send message"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
