"use client";

import React, { useState } from "react";
import Link from "next/link";
import ThemeIcon from "@/components/ui/ThemeIcon";
import { resolveMediaUrl } from "@/lib/media";
import { StorioEvent, StorioCalendarEvent } from "@/types";

interface EventsAndCalendarClientProps {
  events: StorioEvent[];
  calendarEvents: StorioCalendarEvent[];
  siteTitle?: string;
}

export default function EventsAndCalendarClient({
  events,
  calendarEvents,
  siteTitle,
}: EventsAndCalendarClientProps) {
  const [activeTab, setActiveTab] = useState<"events" | "calendar">("events");
  const [calendarFilter, setCalendarFilter] = useState<
    "all" | "holiday" | "exam" | "event"
  >("all");

  const formatEventDate = (dateStr?: string) => {
    if (!dateStr)
      return { day: "15", month: "OCT", year: "2026", time: "9:00 AM" };
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { day, month, year, time };
  };

  const formatCalendarRange = (startStr: string, endStr?: string) => {
    const startDate = new Date(startStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const startFormatted = startDate.toLocaleDateString("en-US", options);

    if (!endStr) return startFormatted;

    const endDate = new Date(endStr);
    // If same date
    if (startDate.toDateString() === endDate.toDateString()) {
      return startFormatted;
    }
    const endFormatted = endDate.toLocaleDateString("en-US", options);
    return `${startFormatted} – ${endFormatted}`;
  };

  const getCategoryBadge = (category?: string) => {
    const cat = (category || "event").toLowerCase();
    switch (cat) {
      case "holiday":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          label: "School Holiday",
        };
      case "exam":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
          label: "Exam Schedule",
        };
      default:
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
          label: "Academic Event",
        };
    }
  };

  const filteredCalendar = calendarEvents.filter((item) => {
    if (calendarFilter === "all") return true;
    return item.category?.toLowerCase() === calendarFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
      {/* Top Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-purple-100">
        <div className="flex flex-col sm:inline-flex sm:flex-row p-1.5 rounded-2xl bg-purple-50 border border-purple-200/80 shadow-2xs w-full sm:w-auto gap-1 sm:gap-0">
          <button
            onClick={() => setActiveTab("events")}
            className={`w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between sm:justify-start gap-2 ${
              activeTab === "events"
                ? "bg-primary-color text-white shadow-sm"
                : "text-gray-600 hover:text-primary-color"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <ThemeIcon name="event-celebration" size={16} />
              <span>School Events</span>
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === "events"
                  ? "bg-white/20 text-white"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {events.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between sm:justify-start gap-2 ${
              activeTab === "calendar"
                ? "bg-primary-color text-white shadow-sm"
                : "text-gray-600 hover:text-primary-color"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <ThemeIcon name="calendar-badge" size={16} />
              <span>Calendar & Holidays</span>
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === "calendar"
                  ? "bg-white/20 text-white"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {calendarEvents.length}
            </span>
          </button>
        </div>

        {/* Filter Pills for Calendar */}
        {activeTab === "calendar" && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500 mr-1">
              Filter:
            </span>
            {[
              { id: "all", label: "All Items" },
              { id: "holiday", label: "Holidays" },
              { id: "exam", label: "Exams" },
              { id: "event", label: "Events" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCalendarFilter(f.id as typeof calendarFilter)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  calendarFilter === f.id
                    ? "bg-primary-color text-white border-primary-color shadow-2xs"
                    : "bg-white text-gray-600 border-purple-200 hover:bg-purple-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: SCHOOL EVENTS GRID */}
      {activeTab === "events" && (
        <>
          {events.length === 0 ? (
            <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
              <ThemeIcon name="calendar-badge" size={48} className="mx-auto mb-3" />
              <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">
                No Upcoming Events
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                New campus events and celebration announcements will appear here
                soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const { day, month, year, time } = formatEventDate(
                  event.start_date,
                );
                const rawImg =
                  event.featured_image_detail?.file ||
                  (typeof event.featured_image === "string"
                    ? event.featured_image
                    : null);
                const imageUrl =
                  resolveMediaUrl(rawImg) ||
                  "/homepage/Happy Memories/Trial 1.jpg";

                return (
                  <article
                    key={event.id}
                    className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group transform hover:-translate-y-1"
                  >
                    {/* Event Image Banner with Date Badge */}
                    <div className="relative aspect-16/10 overflow-hidden bg-purple-50">
                      <img
                        src={imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md text-center min-w-[56px] border border-purple-100">
                        <span className="block text-xl font-black font-fredoka text-primary-color leading-none">
                          {day}
                        </span>
                        <span className="block text-[10px] font-bold tracking-wider text-accent-pink uppercase mt-0.5">
                          {month}
                        </span>
                      </div>

                      {event.is_featured && (
                        <span className="absolute top-4 right-4 bg-accent-pink text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Event Details Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500">
                          <span className="inline-flex items-center gap-1 text-primary-color">
                            <ThemeIcon name="calendar-badge" size={14} /> {time}
                          </span>
                          {event.location && (
                            <span className="inline-flex items-center gap-1 text-gray-600">
                              • <ThemeIcon name="location-pin" size={14} /> {event.location}
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl font-bold font-fredoka text-gray-900 group-hover:text-primary-color transition-colors leading-snug">
                          {event.title}
                        </h2>

                        {(event.excerpt || event.content) && (
                          <p className="text-sm text-gray-600 font-quicksand line-clamp-3 leading-relaxed">
                            {event.excerpt || event.content}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-purple-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-secondary-color">
                          {year}
                        </span>
                        <Link
                          href={`/event/${event.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary-color group-hover:text-accent-pink transition-colors"
                        >
                          <span>Event Details</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: ACADEMIC CALENDAR & HOLIDAYS */}
      {activeTab === "calendar" && (
        <div>
          {filteredCalendar.length === 0 ? (
            <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
              <ThemeIcon name="calendar-badge" size={48} className="mx-auto mb-3" />
              <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">
                No Calendar Items Found
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                No scheduled holidays or academic dates matched the current
                filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCalendar.map((item) => {
                const badge = getCategoryBadge(item.category);
                const startDate = new Date(item.start_date);
                const day = startDate.getDate().toString().padStart(2, "0");
                const month = startDate
                  .toLocaleDateString("en-US", { month: "short" })
                  .toUpperCase();
                const dateRange = formatCalendarRange(
                  item.start_date,
                  item.end_date,
                );

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Category and Level Badges */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${badge.dot}`}
                          />
                          {badge.label}
                        </span>

                        {item.level && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 uppercase tracking-wide">
                            {item.level}
                          </span>
                        )}
                      </div>

                      {/* Date Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-pastel-purple flex flex-col items-center justify-center border border-purple-100 shrink-0">
                          <span className="text-base font-black font-fredoka text-primary-color leading-tight">
                            {day}
                          </span>
                          <span className="text-[10px] font-bold text-accent-pink uppercase leading-none">
                            {month}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary-color">
                            {dateRange}
                          </p>
                          {item.is_all_day && (
                            <span className="text-[11px] text-gray-500 font-medium">
                              All Day Schedule
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold font-fredoka text-gray-900 mb-2">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-gray-600 font-quicksand line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-purple-50 flex items-center justify-between text-xs text-gray-400">
                      <span>Status: Scheduled</span>
                      <span className="font-semibold text-primary-color">
                        {siteTitle || 'Campus Event'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
