import React from 'react';
import { StorioInstitutionProfile } from '@/types';
import SplitText from '@/components/ui/SplitText';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface AboutSectionProps {
  profile: StorioInstitutionProfile | null;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Playful Image Showcase */}
        <div className="lg:col-span-5 relative reveal-on-scroll">
          <div className="relative mx-auto max-w-[420px] rounded-3xl overflow-hidden border-8 border-white shadow-xl transform -rotate-1 hover:rotate-0 hover:scale-102 transition-all duration-500">
            <img
              src={profile.institution_image_url || "/homepage/About Our Academy/Trial 1.jpg"}
              alt="Kindergarten Learners"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 bg-blob-yellow p-4 rounded-2xl shadow-md border-2 border-white transform rotate-3 animate-float">
            <span className="text-2xl font-extrabold text-primary-color">
              10+ Years
            </span>
            <p className="text-xs font-bold text-gray-700">
              Of Joyful Learning
            </p>
          </div>
        </div>

        {/* Right: Mission, Details, and Key Metrics */}
        <div className="lg:col-span-7 space-y-6 reveal-on-scroll delay-150">
          <div className="inline-block bg-accent-soft-blue text-primary-color font-bold text-xs uppercase px-3.5 py-1 rounded-full">
            About Our Academy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-color leading-tight font-fredoka">
            <SplitText
              text="A Loving Second Home for Your Little Ones"
              tag="span"
              splitType="words, chars"
              delay={30}
              duration={0.7}
              ease="power3.out"
              textAlign="left"
              className="inline-block"
            />
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            {profile.school_details ||
              "Little Flowers Kindergarten provides experiential early childhood education centered on play, sensory exploration, creativity, and foundational social skills."}
          </p>

          {/* Stats Highlights with Animated Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-soft-amber border border-amber-200 card-interactive">
              <div className="text-3xl font-extrabold text-secondary-color flex items-center">
                <AnimatedCounter
                  end={profile.total_students || 450}
                  suffix="+"
                />
              </div>
              <div className="text-xs font-bold text-gray-600 mt-1">
                {profile.total_students_label || "Happy Children"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-soft-pink border border-pink-200 card-interactive">
              <div className="text-3xl font-extrabold text-accent-pink flex items-center">
                <AnimatedCounter
                  end={profile.total_teachers || 35}
                  suffix="+"
                />
              </div>
              <div className="text-xs font-bold text-gray-600 mt-1">
                {profile.total_teachers_label || "Caring Mentors"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-accent-soft-blue border border-sky-200 col-span-2 sm:col-span-1 card-interactive">
              <div className="text-3xl font-extrabold text-primary-color flex items-center">
                <AnimatedCounter end={100} suffix="%" />
              </div>
              <div className="text-xs font-bold text-gray-600 mt-1">
                Safe Campus & Care
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-4">
            <a
              href="/admission"
              className="px-6 py-3 bg-secondary-color hover:opacity-90 text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Schedule a Campus Visit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
