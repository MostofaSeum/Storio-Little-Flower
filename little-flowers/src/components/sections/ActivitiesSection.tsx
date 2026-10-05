import React from 'react';
import { StorioActivityItem } from '@/types';
import SplitText from '@/components/ui/SplitText';

interface ActivitiesSectionProps {
  activities: StorioActivityItem[];
}

export default function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  if (!activities || activities.length === 0) return null;

  return (
    <section
      id="programs"
      className="site-section-py site-section-px border-y border-purple-50/50"
    >
      <div className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
          <span className="text-xs font-extrabold tracking-wider uppercase text-accent-pink bg-pink-100 px-3 py-1 rounded-full">
            Early Exploration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-color mt-3 font-fredoka">
            <SplitText
              text="Our Learning Programs"
              tag="span"
              splitType="chars"
              delay={30}
              duration={0.7}
              ease="power3.out"
              className="inline-block"
            />
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Tailored age-appropriate programs designed to kindle imagination
            and social confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.slice(0, 4).map((activity, idx) => {
            const borderColors = [
              "border-secondary-color",
              "border-accent-pink",
              "border-accent-blue",
              "border-accent-green",
            ];
            const badgeColors = [
              "bg-secondary-color text-white",
              "bg-accent-pink text-white",
              "bg-accent-blue text-white",
              "bg-accent-green text-white",
            ];
            const courseGlowClasses = [
              "course-card-amber",
              "course-card-pink",
              "course-card-sky",
              "course-card-lime",
            ];
            const directionClass =
              idx < 2 ? "reveal-from-left" : "reveal-from-right";
            const delayClass =
              idx === 0
                ? "delay-100"
                : idx === 1
                  ? "delay-250"
                  : idx === 2
                    ? "delay-250"
                    : "delay-100";

            const activityImage =
              activity.featured_image_url ||
              ((activity as unknown as { featured_image_data?: { file?: string } })?.featured_image_data?.file
                ? `https://api.storio.cloud${(activity as unknown as { featured_image_data?: { file?: string } })?.featured_image_data?.file}`
                : null);

            return (
              <div
                key={activity.id}
                className={`rounded-3xl p-6 border-2 ${borderColors[idx % 4]} ${courseGlowClasses[idx % 4]} flex flex-col justify-between group card-interactive cursor-pointer ${directionClass} ${delayClass}`}
                style={{ backgroundColor: 'var(--bg-surface, #ffffff)' }}
              >
                <div>
                  {activityImage && (
                    <div className="w-full h-44 rounded-2xl overflow-hidden mb-5">
                      <img
                        src={activityImage}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                      />
                    </div>
                  )}
                  {activity.excerpt && (
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 ${badgeColors[idx % 4]}`}
                    >
                      {activity.excerpt}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-color transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    {activity.summary || activity.content}
                  </p>
                </div>

                <a
                  href={`/activity/${activity.slug || activity.id}`}
                  className="mt-6 text-xs font-bold text-primary-color group-hover:text-accent-pink inline-flex items-center transform group-hover:translate-x-1 transition-transform"
                >
                  Program Details &rarr;
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
