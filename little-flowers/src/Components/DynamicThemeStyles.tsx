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
    accentColor,
    accentBlue,
    backgroundColor,
    surfaceColor,
    topbarBgColor,
    footerColor,
    buttonColor,
    buttonTextColor,
    buttonHoverColor,
    buttonTextHoverColor,
    activeNavBgColor,
    activeNavTextColor,
    textColor,
    headingColor,
    borderRadius,
  } = customization;

  const resolvedPrimary = primaryColor || headingColor || (customization['primary_color'] as string);
  const resolvedSecondary = secondaryColor || (customization['secondary_color'] as string);
  const resolvedAccentPink = accentPink || accentColor || (customization['accent_color'] as string);
  const resolvedAccentBlue = accentBlue || (customization['accent_blue'] as string);
  const resolvedTopbar = topbarBgColor || footerColor || (customization['topbar_bg_color'] as string);
  const resolvedButtonBg = buttonColor || resolvedPrimary || (customization['button_color'] as string);
  const resolvedButtonText = buttonTextColor || (customization['button_text_color'] as string);
  const resolvedText = textColor || (customization['text_color'] as string);
  const resolvedRadius = borderRadius || (customization['border_radius'] as string);

  const cssVariables: string[] = [];

  if (resolvedPrimary) cssVariables.push(`--primary: ${resolvedPrimary};`);
  if (resolvedSecondary) cssVariables.push(`--secondary: ${resolvedSecondary};`);
  if (resolvedAccentPink) {
    cssVariables.push(`--accent-pink: ${resolvedAccentPink};`);
    cssVariables.push(`--accent-pink-hover: ${resolvedAccentPink};`);
  }
  if (resolvedAccentBlue) {
    cssVariables.push(`--accent-soft-blue: ${resolvedAccentBlue};`);
  }
  if (resolvedTopbar) cssVariables.push(`--topbar-bg: ${resolvedTopbar};`);
  if (resolvedButtonBg) cssVariables.push(`--button-bg: ${resolvedButtonBg};`);
  if (resolvedButtonText) cssVariables.push(`--button-text: ${resolvedButtonText};`);
  if (buttonHoverColor) cssVariables.push(`--button-hover: ${buttonHoverColor};`);
  if (buttonTextHoverColor) cssVariables.push(`--button-text-hover: ${buttonTextHoverColor};`);
  if (activeNavBgColor) cssVariables.push(`--active-nav-bg: ${activeNavBgColor};`);
  if (activeNavTextColor) cssVariables.push(`--active-nav-text: ${activeNavTextColor};`);
  if (backgroundColor) cssVariables.push(`--bg-main: ${backgroundColor};`);
  if (surfaceColor) cssVariables.push(`--bg-surface: ${surfaceColor};`);
  if (resolvedText) {
    cssVariables.push(`--text-dark: ${resolvedText};`);
    cssVariables.push(`--text-muted: ${resolvedText};`);
  }
  if (headingColor || resolvedPrimary) cssVariables.push(`--heading-color: ${headingColor || resolvedPrimary};`);
  if (resolvedRadius) cssVariables.push(`--button-border-radius: ${resolvedRadius};`);

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
