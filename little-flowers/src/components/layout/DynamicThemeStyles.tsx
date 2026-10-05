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

  const resolvedPrimary = primaryColor || (customization['primary_color'] as string) || (customization['primaryColor'] as string);
  const resolvedAccentPink = accentColor || (customization['accent_color'] as string) || (customization['accentColor'] as string) || accentPink || (customization['accent_pink'] as string);
  const resolvedButtonHover = buttonHoverColor || (customization['button_hover_color'] as string) || (customization['buttonHoverColor'] as string);
  const resolvedSecondary = secondaryColor || (customization['secondary_color'] as string) || (customization['secondaryColor'] as string) || resolvedButtonHover || resolvedAccentPink || resolvedPrimary;
  const resolvedAccentBlue = accentBlue || (customization['accent_blue'] as string) || (customization['accentBlue'] as string);
  const resolvedTopbar = topbarBgColor || (customization['topbar_bg_color'] as string) || (customization['topbarBgColor'] as string);
  const resolvedButtonBg = buttonColor || (customization['button_color'] as string) || (customization['buttonColor'] as string);
  const resolvedButtonText = buttonTextColor || (customization['button_text_color'] as string) || (customization['buttonTextColor'] as string);
  const resolvedButtonTextHover = buttonTextHoverColor || (customization['button_text_hover_color'] as string) || (customization['buttonTextHoverColor'] as string);
  const resolvedActiveNavBg = activeNavBgColor || (customization['active_nav_bg_color'] as string) || (customization['activeNavBgColor'] as string) || resolvedPrimary;
  const resolvedActiveNavText = activeNavTextColor || (customization['active_nav_text_color'] as string) || (customization['activeNavTextColor'] as string);
  const resolvedBg = backgroundColor || (customization['background_color'] as string) || (customization['backgroundColor'] as string);
  const resolvedSurface = surfaceColor || (customization['surface_color'] as string) || (customization['surfaceColor'] as string);
  const resolvedFooter = footerColor || (customization['footer_color'] as string) || (customization['footerColor'] as string);
  const resolvedText = textColor || (customization['text_color'] as string) || (customization['textColor'] as string);
  const resolvedHeading = headingColor || (customization['heading_color'] as string) || (customization['headingColor'] as string) || resolvedPrimary;
  const resolvedRadius = borderRadius || (customization['border_radius'] as string) || (customization['borderRadius'] as string);

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
  if (resolvedButtonHover) cssVariables.push(`--button-hover: ${resolvedButtonHover};`);
  if (resolvedButtonTextHover) cssVariables.push(`--button-text-hover: ${resolvedButtonTextHover};`);
  if (resolvedActiveNavBg) cssVariables.push(`--active-nav-bg: ${resolvedActiveNavBg};`);
  if (resolvedActiveNavText) cssVariables.push(`--active-nav-text: ${resolvedActiveNavText};`);
  if (resolvedBg) cssVariables.push(`--bg-main: ${resolvedBg};`);
  if (resolvedSurface) cssVariables.push(`--bg-surface: ${resolvedSurface};`);
  if (resolvedFooter) cssVariables.push(`--footer-bg: ${resolvedFooter};`);
  if (resolvedText) {
    cssVariables.push(`--text-dark: ${resolvedText};`);
    cssVariables.push(`--text-muted: ${resolvedText};`);
  }
  if (resolvedHeading) cssVariables.push(`--heading-color: ${resolvedHeading};`);
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
