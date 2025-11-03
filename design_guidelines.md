# UniChoice Design Guidelines - Enhancement Integration

## Project Context
This is an **enhancement project** for an existing, fully-functional UniChoice website. The primary goal is to integrate real QS Rankings 2025 data while **preserving all existing design, layout, and functionality**.

## Design Approach: Preservation & Seamless Integration

**Core Principle**: Maintain 100% of existing visual design, component structure, and user experience. New data fields must integrate invisibly into current patterns.

## Data Integration Guidelines

### New Data Display Requirements

**University Cards/Listings Enhancement**:
- QS Ranking badge: Small, unobtrusive indicator (e.g., "#3 QS 2025") positioned consistently with existing badges
- Tuition cost: Display in existing price/info section using current typography hierarchy
- International students %: Integrate as an additional stat alongside existing metrics
- Match existing card styling exactly - colors, spacing, borders, shadows

**Admission Requirements Section**:
- Create tabbed interface (Bachelor/Master) if space allows, or stacked sections
- Use existing typography scale for headers, body text, and lists
- Maintain current spacing rhythm between requirement items
- Format as clear, scannable lists matching site's existing list styles

### Country Name Standardization

**Display Format**:
- Full country names throughout: "United States", "United Kingdom", "Germany", "Australia", etc.
- Update all filters, dropdowns, and search components to use full names
- Maintain existing flag icons/indicators if present
- Keep current country selector UI pattern exactly as designed

### Filter System Consistency

**Country Filter Updates**:
- Preserve existing filter component design completely
- Update options to full country names while maintaining alphabetical sorting
- Keep current filter interactions (checkboxes, dropdowns, or whatever exists)
- No changes to filter positioning, styling, or behavior

## Layout Preservation Rules

**Strict Constraints**:
- Zero changes to existing color scheme
- Zero changes to typography choices (fonts, sizes, weights)
- Zero changes to spacing system or component margins/padding
- Zero changes to navigation structure or footer design
- Zero changes to hero sections, banners, or marketing content
- Zero changes to existing animations or transitions

**Integration Method**:
- New data fields slot into existing component structures
- Admission requirements appear in existing detail/modal patterns
- Enhanced university data uses current card/list templates
- All additions feel native to the original design system

## Content Enhancement Without Redesign

**University Detail Pages** (if applicable):
- Add admission requirements section below existing content blocks
- Use existing section header styles
- Maintain current content width constraints
- Follow established vertical rhythm

**Data Accuracy Display**:
- Small "Verified QS 2025" badge or indicator where appropriate
- Use existing badge/tag styling patterns
- Position consistently across all university entries

## Technical Implementation Notes

**JSON Structure**:
- Extend universities.json with new fields without removing any existing properties
- Maintain all current data: summary, majors, deadlines, cases, etc.
- Add: qsRanking, tuitionAnnualUSD, internationalStudentsPercent, admissionRequirements (bachelor/master objects)
- Convert country values to full names: country: "United States" instead of "US"

**No Visual Breaking Changes**:
- Site must look identical after enhancement
- Users should perceive this as "more complete data" not "redesigned interface"
- Enhanced functionality should feel like natural evolution, not disruption

## Summary

This is a **data enhancement project**, not a redesign. Every design decision must prioritize seamless integration with the existing, working UniChoice interface. The goal is richer, verified university data within the exact same user experience.