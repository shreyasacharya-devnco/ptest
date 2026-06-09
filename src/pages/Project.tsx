import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomCursor } from "@/components/CustomCursor";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import kazeProject from "@/assets/kaze-project.png";
import kazeCover from "@/assets/kaze-cover.png";
import stravaCover from "@/assets/strava-cover.png";
import stravaIntro from "@/assets/strava-intro.png";
import strava1 from "@/assets/strava-1.png";
import strava2 from "@/assets/strava-2.png";
import strava3 from "@/assets/strava-3.png";
import strava4 from "@/assets/strava-4.png";
import strava5 from "@/assets/strava-5.png";
import stravaLast from "@/assets/strava-1.png";
import mooloCover from "@/assets/moolo-cover.png";
import mooloIntro1 from "@/assets/moolo-intro-1.png";
import mooloIntro2 from "@/assets/moolo-intro-2.png";
import mooloIntro3 from "@/assets/moolo-intro-3.png";
import mooloIntro4 from "@/assets/moolo-intro-4.png";
import mooloIntro5 from "@/assets/moolo-intro-5.png";
import mooloIntro6 from "@/assets/moolo-intro-6.png";
import mooloIntro7 from "@/assets/moolo-intro-7.png";
import mooloIntro8 from "@/assets/moolo-intro-8.png";
import mooloIntro9 from "@/assets/moolo-intro-9.png";
import mooloIntro10 from "@/assets/moolo-intro-10.png";
import mooloFirst from "@/assets/moolo-first.jpg";
import mooloSecond from "@/assets/moolo-second.jpg";
import shelterCover from "@/assets/shelter-cover.png";
import shelter1 from "@/assets/shelter-1.png";
import shelter2 from "@/assets/shelter-2.png";
import shelter3 from "@/assets/shelter-3.png";
import shelter4 from "@/assets/shelter-4.png";
import shelter5 from "@/assets/shelter-5.png";
import shelter6 from "@/assets/shelter-6.png";
import shelter7 from "@/assets/shelter-7.png";
import shelter8 from "@/assets/shelter-8.png";
import shelter9 from "@/assets/shelter-9.png";
import shelter10 from "@/assets/shelter-10.png";
import shelter11 from "@/assets/shelter-11.png";
import shelter12 from "@/assets/shelter-12.png";
import shelter13 from "@/assets/shelter-13.png";
import shelter14 from "@/assets/shelter-14.png";
import kalakoshaCover from "@/assets/kalakosha-cover.png";
import kalakosha1 from "@/assets/kalakosha-1.png";
import kalakosha2 from "@/assets/kalakosha-2.png";
import kalakosha3 from "@/assets/kalakosha-3.png";
import kalakosha4 from "@/assets/kalakosha-4.png";
import kalakosha5 from "@/assets/kalakosha-5.png";
import visualRepCover from "@/assets/visual-rep-cover.png";
import visualRep1 from "@/assets/visual-rep-1.png";
import visualRep2 from "@/assets/visual-rep-2.png";
import visualRep3 from "@/assets/visual-rep-3.png";
import visualRep4 from "@/assets/visual-rep-4.png";
import visualRep5 from "@/assets/visual-rep-5.png";
import visualRep6 from "@/assets/visual-rep-6.png";
import visualRep7 from "@/assets/visual-rep-7.png";
import visualRep8 from "@/assets/visual-rep-8.png";
import visualRep9 from "@/assets/visual-rep-9.png";
import visualRep10 from "@/assets/visual-rep-10.png";
import recovrCover from "@/assets/recovr-cover.png";
import recovr1 from "@/assets/recovr-1.png";
import recovr2 from "@/assets/recovr-2.png";
import recovr3 from "@/assets/recovr-3.png";
import recovr4 from "@/assets/recovr-4.png";
import recovr5 from "@/assets/recovr-5.png";
import recovr6 from "@/assets/recovr-6.png";
import recovr7 from "@/assets/recovr-7.png";
import recovr8 from "@/assets/recovr-8.png";
import recovr9 from "@/assets/recovr-9.png";
import recovr10 from "@/assets/recovr-10.png";
import recovr11 from "@/assets/recovr-11.png";
import recovr12 from "@/assets/recovr-12.png";
import recovr13 from "@/assets/recovr-13.png";
import recovr14 from "@/assets/recovr-14.png";
import recovr15 from "@/assets/recovr-15.png";
import recovr16 from "@/assets/recovr-16.png";
import recovr17 from "@/assets/recovr-17.png";
import recovr18 from "@/assets/recovr-18.png";
import recovr19 from "@/assets/recovr-19.png";
import eclipseraCover from "@/assets/eclipsera-cover.png";
import eclipsera1 from "@/assets/eclipsera-1.png";
import eclipsera2 from "@/assets/eclipsera-2.png";
import eclipsera3 from "@/assets/eclipsera-3.png";
import eclipsera4 from "@/assets/eclipsera-4.png";
import eclipsera5 from "@/assets/eclipsera-5.png";
import eclipsera6 from "@/assets/eclipsera-6.png";
import eclipsera7 from "@/assets/eclipsera-7.png";
import eclipsera8 from "@/assets/eclipsera-8.png";
import eclipsera9 from "@/assets/eclipsera-9.png";
import eclipsera10 from "@/assets/eclipsera-10.png";
import eclipsera11 from "@/assets/eclipsera-11.png";
import eclipsera12 from "@/assets/eclipsera-12.png";
import eclipsera13 from "@/assets/eclipsera-13.png";
import eclipsera14 from "@/assets/eclipsera-14.png";

interface ProjectImage {
  src: string;
  alt: string;
  embedCode?: string;
}

const projects = [
  {
    id: "strava-gamification",
    title: "Gamifying the Strava Experience",
    description:
      "Gamified the Strava app using the Octalysis Framework. Designed and tested UI concepts to boost weak core drives, improving user motivation and engagement.",
    tags: ["UX Research", "UI Design", "Prototyping"],
    coverImage: stravaCover,
    projectImages: [
      {
        src: stravaIntro,
        alt: "Strava gamification introduction",
        embedCode: '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/cSx460aMzQIEwQxc39xJvS/Visual-feedback-mechanism--Toast-Notification-?page-id=0%3A1&node-id=1-70&p=f&viewport=471%2C362%2C0.18&scaling=scale-down&content-scaling=fixed&embed-host=share" allowfullscreen></iframe>',
      },
      {
        src: strava2,
        alt: "Experience Points & Levels",
        embedCode: '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/lzEeKTXYT52Vq7mjWeuX7w/Experience-Points---levels?page-id=0%3A1&node-id=1-176&p=f&viewport=417%2C193%2C0.18&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A176&embed-host=share" allowfullscreen></iframe>',
      },
      {
        src: strava3,
        alt: "Purpose-driven goals",
        embedCode: '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/Xn11zNHVuQ0IoLLC8O0euh/Purpose-Driven-Goals?page-id=0%3A1&node-id=1-55&p=f&viewport=541%2C438%2C0.5&scaling=min-zoom&content-scaling=fixed&embed-host=share" allowfullscreen></iframe>',
      },
      {
        src: strava4,
        alt: "Real-Time Feedback / Audio Feedback",
        embedCode: '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/XpJXSMEs29em0rSDXW72ko/Real-Time-Feedback---Audio-Feedback?page-id=0%3A1&node-id=1-6&p=f&viewport=45%2C201%2C0.32&scaling=min-zoom&content-scaling=fixed&embed-host=share" allowfullscreen></iframe>',
      },
      {
        src: strava5,
        alt: "Badges",
        embedCode: '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/YsgPCUUckvt1mT6WclhoX5/Badges?page-id=0%3A1&node-id=0-228&p=f&viewport=200%2C93%2C0.17&scaling=min-zoom&content-scaling=fixed&embed-host=share" allowfullscreen></iframe>',
      },
      {
        src: stravaLast,
        alt: "Strava gamification summary",
      },
    ] as ProjectImage[],
  },
  {
    id: "moolo-iot",
    title: "IoT-Based Kids Tangible Product",
    description:
      "Iot based interactive device that simplifies complex financial concepts through engaging, hands-on learning.",
    tags: ["Tangible Interaction", "IOT", "Machine learning"],
    coverImage: mooloCover,
    projectImages: [
      {
        src: mooloIntro1,
        alt: "Moolo IoT project overview",
      },
      {
        src: mooloIntro2,
        alt: "Moolo process followed",
      },
      {
        src: mooloIntro3,
        alt: "Moolo desk research statistics",
      },
      {
        src: mooloIntro4,
        alt: "Moolo financial topics taught",
      },
      {
        src: mooloIntro5,
        alt: "Moolo primary research",
      },
      {
        src: mooloIntro6,
        alt: "Moolo personas",
      },
      {
        src: mooloIntro7,
        alt: "Moolo affinity mapping",
      },
      {
        src: mooloIntro8,
        alt: "Moolo problem statement",
      },
      {
        src: mooloIntro9,
        alt: "Moolo early concept",
      },
      {
        src: mooloIntro10,
        alt: "Moolo video demonstration",
        embedCode: '<iframe width="560" height="315" src="https://www.youtube.com/embed/gi5Yng4cE50?si=q2HzAbma9bGjzdZx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
      },
      {
        src: mooloSecond,
        alt: "Moolo product features",
      },
    ] as ProjectImage[],
  },
  {
    id: "kaze-airlines",
    title: "Kaze Airlines branding",
    description:
      "Designing with intent, blending innovation and aesthetics to create intuitive, user-centered experiences.",
    tags: ["Branding", "Visual Design", "Visual Design"],
    coverImage: kazeCover,
    projectImages: [
      {
        src: kazeProject,
        alt: "Kaze Airlines branding",
      },
    ] as ProjectImage[],
  },
  {
    id: "shelter-to-home",
    title: "Shelter to Home",
    description:
      "Creating a digital platform designed to help animal NGOs boost adoptions, attract volunteers, and secure donations. Through a data-driven approach, it identifies challenges in these areas and provides solutions to bridge the gaps effectively.",
    tags: ["Data Driven UX", "Data Visualization", "Social Design"],
    coverImage: shelterCover,
    projectImages: [
      {
        src: shelter1,
        alt: "Shelter to Home overview",
      },
      {
        src: shelter2,
        alt: "Shelter to Home hypothesis and research",
      },
      {
        src: shelter3,
        alt: "Shelter to Home desk research",
      },
      {
        src: shelter4,
        alt: "Shelter to Home affinity mapping",
      },
      {
        src: shelter5,
        alt: "Shelter to Home affinity mapping volunteers",
      },
      {
        src: shelter6,
        alt: "Shelter to Home data visualization",
      },
      {
        src: shelter7,
        alt: "Shelter to Home insights",
      },
      {
        src: shelter8,
        alt: "Shelter to Home solution",
      },
      {
        src: shelter9,
        alt: "Shelter to Home data analysis insights",
      },
      {
        src: shelter10,
        alt: "Shelter to Home problems with existing products",
      },
      {
        src: shelter11,
        alt: "Shelter to Home problem statement and features",
      },
      {
        src: shelter12,
        alt: "Shelter to Home user flow and prototypes",
      },
      {
        src: shelter13,
        alt: "Shelter to Home color palette and logo",
      },
      {
        src: shelter14,
        alt: "Shelter to Home high fidelity designs",
      },
    ] as ProjectImage[],
  },
  {
    id: "kala-kosha",
    title: "Kala Kosha",
    description:
      "Empowering traditional Indian artisans by providing digital tools to showcase their craft globally, enhancing their reach, recognition, and financial stability.",
    tags: ["Dashboard", "User Interface", "Prototyping"],
    coverImage: kalakoshaCover,
    projectImages: [
      {
        src: kalakosha1,
        alt: "Kala Kosha overview",
      },
      {
        src: kalakosha2,
        alt: "Kala Kosha context and research",
      },
      {
        src: kalakosha3,
        alt: "Kala Kosha stakeholders and interfaces",
      },
      {
        src: kalakosha4,
        alt: "Kala Kosha information architecture",
      },
      {
        src: kalakosha5,
        alt: "Kala Kosha admin panel architecture",
        embedCode: '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/8B9aycTf6YMcwwsLPrgMUo/Smart-Artisans?page-id=974%3A1106&node-id=3003-11222&viewport=-3121%2C-1621%2C0.11&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=3003%3A11222&embed-host=share" allowfullscreen></iframe>',
      },
    ] as ProjectImage[],
  },
  {
    id: "visual-representation",
    title: "Visual Representation",
    description:
      "Created a set of illustrations using a consistent set of visual elements to demonstrate how the same components can be rearranged and transformed to produce varied yet thematically linked visuals.",
    tags: ["Illustrations", "Mock Ups", "Semiotics"],
    coverImage: visualRepCover,
    projectImages: [
      {
        src: visualRep1,
        alt: "Visual Representation - Elements Used",
      },
      {
        src: visualRep2,
        alt: "Visual Representation - Colors and Ideations",
      },
      {
        src: visualRep3,
        alt: "Visual Representation - Illustrations Part 1",
      },
      {
        src: visualRep4,
        alt: "Visual Representation - Illustrations Part 2",
      },
      {
        src: visualRep5,
        alt: "Visual Representation - Typography and 12x12 Poster",
      },
      {
        src: visualRep6,
        alt: "Visual Representation - A4 Poster and 12x12 Poster",
      },
      {
        src: visualRep7,
        alt: "Visual Representation - Playing Cards and Mock-ups",
      },
      {
        src: visualRep8,
        alt: "Visual Representation - Mock-ups Part 1",
      },
      {
        src: visualRep9,
        alt: "Visual Representation - Mock-ups Part 2",
      },
      {
        src: visualRep10,
        alt: "Visual Representation - Thank You",
      },
    ] as ProjectImage[],
  },
  {
    id: "recovr",
    title: "recoVR - Virtual Exposure Therapy",
    description:
      "A VR-based exposure therapy tool designed to help users confront and manage their phobias in a safe, private, and controlled virtual environment. From trigger to triumph.",
    tags: ["VR Design", "UX Research", "Unity Development"],
    coverImage: recovrCover,
    projectImages: [
      {
        src: recovr1,
        alt: "recoVR Project Overview - Team and Mentors",
      },
      {
        src: recovr2,
        alt: "recoVR Process - Lean UX Methodology",
      },
      {
        src: recovr3,
        alt: "recoVR Research - Types and Causes of Phobias",
      },
      {
        src: recovr4,
        alt: "recoVR Research - Exposure Therapy and VR Benefits",
      },
      {
        src: recovr5,
        alt: "recoVR Analysis - Competitive Analysis and Persona",
      },
      {
        src: recovr6,
        alt: "recoVR Design - Storyboarding and Problem Statement",
      },
      {
        src: recovr7,
        alt: "recoVR Design - Brainstorming and Value Effort Matrix",
      },
      {
        src: recovr8,
        alt: "recoVR Solution - MVP Features and Target Phobias",
      },
      {
        src: recovr9,
        alt: "recoVR Design - Phobia Scenarios",
      },
      {
        src: recovr10,
        alt: "recoVR Design - User Flow for Acrophobia",
      },
      {
        src: recovr11,
        alt: "recoVR Design - Low Fidelity Wireframes",
      },
      {
        src: recovr12,
        alt: "recoVR Design - Stage Wireframes",
      },
      {
        src: recovr13,
        alt: "recoVR Design - Logo Explorations",
      },
      {
        src: recovr14,
        alt: "recoVR Design - Mood Board",
      },
      {
        src: recovr15,
        alt: "recoVR Design - Icon Design",
      },
      {
        src: recovr16,
        alt: "recoVR Design - Final UI Screens",
      },
      {
        src: recovr17,
        alt: "recoVR Video Demonstration",
        embedCode: '<iframe width="560" height="315" src="https://www.youtube.com/embed/d49Fko3sN5c?si=HheB6gEX_yWzOqEO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
      },
      {
        src: recovr18,
        alt: "recoVR Testing - Check Phase and Usability Testing",
      },
      {
        src: recovr19,
        alt: "recoVR - Thank You for Joining the Journey",
      },
    ] as ProjectImage[],
  },
  {
    id: "eclipsera",
    title: "Eclipsera - Physical Board Game Design",
    description:
      "A sci-fi adventure board game where two universes collide. Players must close portals, face demons, and defeat a final villain to restore balance through strategic decision-making and suspense.",
    tags: ["Game Design", "Physical Product", "Prototyping"],
    coverImage: eclipseraCover,
    projectImages: [
      {
        src: eclipsera1,
        alt: "Eclipsera - Game box showing the title and tagline",
      },
      {
        src: eclipsera2,
        alt: "Eclipsera - Mind map exploring sci-fi themes",
      },
      {
        src: eclipsera3,
        alt: "Eclipsera - Concept description and game premise",
      },
      {
        src: eclipsera4,
        alt: "Eclipsera - Introduction to concept and theme",
      },
      {
        src: eclipsera5,
        alt: "Eclipsera - The experience we wanted players to have",
      },
      {
        src: eclipsera6,
        alt: "Eclipsera - Stage 1: The Initial Prototype",
      },
      {
        src: eclipsera7,
        alt: "Eclipsera - Testing and observing initial feedback",
      },
      {
        src: eclipsera8,
        alt: "Eclipsera - Stage 2: The Mid-Fidelity Prototype",
      },
      {
        src: eclipsera9,
        alt: "Eclipsera - Testing and observation of improvements",
      },
      {
        src: eclipsera9,
        alt: "Eclipsera - Stage 3: Final game development",
      },
      {
        src: eclipsera10,
        alt: "Eclipsera - Mood Board and Final board design",
      },
      {
        src: eclipsera11,
        alt: "Eclipsera - Cards: Tool cards and Demon cards with designs",
      },
      {
        src: eclipsera12,
        alt: "Eclipsera - The Spinning wheel concept, Pawns, and Instruction manual",
      },
      {
        src: eclipsera13,
        alt: "Eclipsera - Packaging design and Die line",
      },
      {
        src: eclipsera14,
        alt: "Eclipsera - Final prototype and team",
      },
    ] as ProjectImage[],
  },
];

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  
  // All entries now show images, so count all
  const actualImagesCount = project?.projectImages.length || 0;
  const initialLoadCount = Math.min(3, actualImagesCount); // Wait for up to 3 images, or all if fewer
  const isInitialLoadComplete = loadedImagesCount >= initialLoadCount || actualImagesCount === 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoadedImagesCount(0); // Reset count when project changes
  }, [id]);

  const handleImageLoad = () => {
    setLoadedImagesCount((prev) => prev + 1);
  };

  if (!project) {
    return <div>Project not found</div>;
  }

  const otherProjects = projects.filter((p) => p.id !== id);
  
  // Track which images need to load for initial screen
  let imageLoadIndex = 0;

  return (
    <div className="min-h-screen">
      <CustomCursor />
      
      {/* Loading Screen */}
      {!isInitialLoadComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-muted-foreground">Loading project...</p>
          </div>
        </div>
      )}

      {/* Floating Sticky Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background shadow-lg"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Project Content */}
      <div className="w-full">
        {project.projectImages.map((image, index) => {
          const shouldTrackLoad = imageLoadIndex < initialLoadCount;
          imageLoadIndex++;
          
          return (
            <div key={index} className="w-full flex flex-col items-center justify-center">
              {/* Project Image */}
              <img
                src={image.src}
                alt={image.alt}
                onLoad={shouldTrackLoad ? handleImageLoad : undefined}
                className="max-w-6xl w-full h-auto object-contain shadow-none mx-auto"
              />
              
              {/* Figma Embed - Show below image if present */}
              {image.embedCode && (
                <div className="max-w-6xl w-full py-8">
                  <div 
                    className="w-full h-[70vh] bg-muted/20 rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ 
                      __html: image.embedCode.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"')
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* View Other Projects Section */}
      <section className="py-20 bg-muted/30 mt-16">
        <div className="container mx-auto px-6">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 max-w-6xl mx-auto">View Other Projects</h2>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                {otherProjects.map((otherProject) => (
                  <CarouselItem key={otherProject.id}>
                    <article 
                      className="grid lg:grid-cols-2 gap-8 items-center cursor-pointer"
                      onClick={() => navigate(`/project/${otherProject.id}`)}
                    >
                      {/* Project Image */}
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                        <img
                          src={otherProject.coverImage}
                          alt={otherProject.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Project Details */}
                      <div className="space-y-4">
                        <h3 className="text-2xl lg:text-3xl font-bold leading-tight">
                          {otherProject.title}
                        </h3>

                        <div className="flex flex-wrap gap-2">
                          {otherProject.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="rounded-full px-4 py-1.5 text-sm border-2 border-foreground"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-base text-muted-foreground leading-relaxed">
                          {otherProject.description}
                        </p>
                      </div>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      <Footer />
    </div>
  );
}
