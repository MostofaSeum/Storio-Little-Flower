import React from "react";

export type IconName =
  | "briefcase-career"
  | "calendar-badge"
  | "document-paper"
  | "download-card"
  | "event-celebration"
  | "exam-report"
  | "flower-blossom"
  | "location-pin"
  | "mail-envelope"
  | "megaphone-notice"
  | "open-book"
  | "palette-art"
  | "people-group"
  | "phone-call"
  | "play-video"
  | "school-bag"
  | "school-building"
  | "scroll-certificate"
  | "sparkle-star"
  | "sprout-admissions"
  | "success-check"
  | "video-clapper"
  | "warning-alert";

interface ThemeIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: IconName;
  size?: number | string;
  className?: string;
  alt?: string;
}

export const ThemeIcon: React.FC<ThemeIconProps> = ({
  name,
  size = 20,
  className = "",
  alt,
  style,
  ...props
}) => {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt={alt || `${name} icon`}
      width={size}
      height={size}
      className={`inline-block shrink-0 select-none align-middle object-contain ${className}`}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        ...style,
      }}
      loading="lazy"
      {...props}
    />
  );
};

export default ThemeIcon;
