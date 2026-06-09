import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const UXCompetencies = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  const competencies = [
    {
      category: "User Research",
      skills: [
        "User Interviews",
        "Surveys & Questionnaires",
        "Affinity Mapping",
        "Persona Development",
        "Empathy Mapping",
        "User Journey Mapping",
        "User Testing",
        "Ethnography",
        "Storyboarding",
        "UX Audits"
      ]
    },
    {
      category: "Interaction & Visual Design",
      skills: [
        "Wireframing",
        "Prototyping",
        "UI Design",
        "Information Architecture",
        "Card Sorting",
        "Design Systems",
        "Task Flows / User Flows",
        "Gamification",
        "Accessibility Design",
        "Data Visualization"
      ]
    },
    {
      category: "UX Strategy & Thinking",
      skills: [
        "Design Thinking",
        "User-Centered Design",
        "Lean UX",
        "Problem Definition",
        "Service Blueprints"
      ]
    },
    {
      category: "Collaboration & Development",
      skills: [
        "Agile & Scrum Methodologies",
        "Developer Handoff",
        "Basic HTML/CSS, JavaScript & Bootstrap",
        "Low Code & Low Code Tools"
      ]
    }
  ];

  // Stack-style reveal: each competency card scales/slides up into place from
  // behind the previous one as it scrolls into view, mirroring the Education
  // and Work Experience sections.
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!gridRef.current) return;
      const items = gsap.utils.toArray<HTMLElement>(":scope > div", gridRef.current);
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 90, scale: 0.92, transformOrigin: "center top" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none reverse"
            }
          }
        );
        gsap.set(item, { zIndex: items.length - i, position: "relative" });
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-6 pt-20 pb-12">
      <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
        UX Competencies
      </h2>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {competencies.map((section, index) => (
          <div key={index} className="space-y-3 p-5 rounded-lg bg-gray-100 dark:bg-gray-800/50">
            <h3 className="text-base font-semibold text-foreground">
              {section.category}
            </h3>
            <ul className="space-y-1.5">
              {section.skills.map((skill, skillIndex) => (
                <li
                  key={skillIndex}
                  className="text-sm text-muted-foreground flex items-start transition-all duration-200 hover:text-foreground hover:translate-x-1 cursor-pointer"
                >
                  <span className="mr-2 text-foreground">•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
