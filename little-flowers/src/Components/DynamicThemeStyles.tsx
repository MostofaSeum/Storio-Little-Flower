import React from 'react';
import { LittleFlowersCustomizationConfig } from '@/data/storioExtendedTypes';

interface DynamicThemeStylesProps {
  customization?: LittleFlowersCustomizationConfig | null;
}

/**
 * DynamicThemeStyles
 * 
 * Injects dynamic CSS variables into the page from the Storio CMS Customization Config.
 * When the admin updates primaryColor, secondaryColor, accentPink, topbarBgColor,
 * buttonColor, fontFamily, or borderRadius in the Storio Admin Dashboard,
 * this component automatically overrides the default CSS variables in real time.
 */
export default function DynamicThemeStyles({ customization }: DynamicThemeStylesProps) {
  if (!customization) return null;

  const {
    primaryColor,
    secondaryColor,
    accentPink,
    accentBlue,
    topbarBgColor,
    buttonColor,
    buttonTextColor,
    textColor,
    borderRadius,
  } = customization;

  const cssVariables: string[] = [];

  if (primaryColor) cssVariables.push(`--primary: ${primaryColor};`);
  if (secondaryColor) cssVariables.push(`--secondary: ${secondaryColor};`);
  if (accentPink) {
    cssVariables.push(`--accent-pink: ${accentPink};`);
    cssVariables.push(`--accent-pink-hover: ${accentPink};`);
  }
  if (accentBlue) {
    cssVariables.push(`--accent-soft-blue: ${accentBlue};`);
  }
  if (topbarBgColor) cssVariables.push(`--topbar-bg: ${topbarBgColor};`);
  if (buttonColor) cssVariables.push(`--button-bg: ${buttonColor};`);
  if (buttonTextColor) cssVariables.push(`--button-text: ${buttonTextColor};`);
  if (textColor) {
    cssVariables.push(`--text-dark: ${textColor};`);
    cssVariables.push(`--text-muted: ${textColor};`);
  }
  if (borderRadius) cssVariables.push(`--button-border-radius: ${borderRadius};`);

  if (cssVariables.length === 0) return null;

  const styleContent = `:root {
  ${cssVariables.join('\n  ')}
}`;

  return (
    <style
      id="storio-dynamic-theme"
      dangerouslySetInnerHTML={{ __html: styleContent }}
    />
  );
}
