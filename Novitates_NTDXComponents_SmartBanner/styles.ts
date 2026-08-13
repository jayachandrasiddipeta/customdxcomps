// individual style, comment out above, and uncomment here and add styles
import styled, { css } from 'styled-components';
import { StyledBannerMessageList, StyledBannerStatus } from '@pega/cosmos-react-core/lib/components/Banner/Banner';
import { StyledCount } from '@pega/cosmos-react-core/lib/components/Badges/Count';
import { StyledList } from '@pega/cosmos-react-core/lib/components/List/List';

type MainContentProps = {
  $headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  $singleMessage?: boolean;
  $hideExpandCollapse?: boolean;
  $hideCount?: boolean;
};

/**
 * Banner only skips its <ul> for a single message when no custom heading is set — once
 * headingText is provided, one message still renders through the multi-message list branch.
 * That branch reserves bullet indent at THREE nested levels: Banner's own
 * StyledBannerMessageList wrapper, the generic List component's StyledList div it wraps
 * (List.js, not Banner-specific), and StyledList's own nested `<ul>` rule. All three must
 * be zeroed or the single entry still sits indented even with its bullet hidden. Targets
 * each component's own exported styled-component rather than internal classnames, so this
 * survives Cosmos version bumps.
 */
const singleMessageStyles = css`
  ${StyledBannerMessageList} {
    padding-inline-start: 0;
  }
  ${StyledBannerMessageList} ${StyledList} {
    padding-inline-start: 0;
  }
  ${StyledBannerMessageList} ${StyledList} > ul {
    padding-inline-start: 0;
    list-style-type: none;
  }
`;

/** Hides Banner's own expand/collapse toggle button. Targets its public data-testid
 * (from Banner.test-ids.ts) rather than an internal classname. Forcing the banner to stay
 * expanded when the toggle is hidden is handled separately in index.tsx (there's no prop
 * to control Banner's internal collapsed state, so it's driven by a forced click instead). */
const hideExpandCollapseStyles = css`
  [data-testid*='expand-collapse'] {
    display: none;
  }
`;

/** Hides Banner's message-count badge next to the heading. Targets Badge's own exported
 * StyledCount rather than an internal classname. */
const hideCountStyles = css`
  ${StyledCount} {
    display: none;
  }
`;

/** Adds breathing room between the heading row and the first message — Banner's own
 * layout has effectively none. Scoped to the message list so it doesn't affect Banner's
 * single-message (no-heading) branch, which already sits directly under the icon. */
const messageSpacingStyles = css`
  ${StyledBannerMessageList} {
    margin-block-start: var(--p-spacing-sm, 0.5rem);
  }
`;

/** Visual sizing for banner heading by tag – OOTB Banner keeps variant 'h2', so we override by level for UI feedback. */
const headingLevelStyles = css<MainContentProps>`
  &[data-heading-tag='h1'] h1 {
    font-size: 1.75rem;
    font-weight: 700;
  }
  &[data-heading-tag='h2'] h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
  &[data-heading-tag='h3'] h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }
  &[data-heading-tag='h4'] h4 {
    font-size: 1.125rem;
    font-weight: 600;
  }
  &[data-heading-tag='h5'] h5 {
    font-size: 1rem;
    font-weight: 600;
  }
  &[data-heading-tag='h6'] h6 {
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

export default styled.div.attrs<MainContentProps>((props) => ({
  'data-heading-tag': props.$headingTag ?? 'h2',
}))<MainContentProps>`
  margin: 0px 0;
  /* Banner's own StyledBanner reads border-radius: var(--border-radius, theme-card-radius)
   * — an intentional override hook, not a workaround. A light, fixed curve rather than a
   * full pill (9999px would clamp to fully round on a short collapsed banner). */
  --border-radius: 0.75rem;
  ${headingLevelStyles}
  ${messageSpacingStyles}
  ${props => props.$singleMessage && singleMessageStyles}
  ${props => props.$hideExpandCollapse && hideExpandCollapseStyles}
  ${props => props.$hideCount && hideCountStyles}
`;

/** Positions the icon overlay relative to Banner's own rendered box. Banner itself is
 * the only child, so this wrapper's size always matches Banner's exactly. */
export const StyledBannerIconHost = styled.div`
  position: relative;
`;

/**
 * Visually replaces Banner's own status icon by covering it with an identically-styled
 * (same variant, so identical background/border/color) overlay showing our chosen icon
 * instead. Reuses Banner's own exported StyledBannerStatus rather than guessing colors,
 * so it always matches whatever theme Banner itself renders with.
 *
 * `2rem` matches Banner's own grid column width (`cols: '2rem minmax(0, 1fr)'` in
 * Banner.js) — not a guess, but it is an internal implementation detail of Banner that
 * could change on a future Cosmos upgrade, in which case this offset would need revisiting.
 */
export const StyledBannerIconOverlay = styled(StyledBannerStatus)`
  /* StyledBannerStatus sets these to \`inherit\`, which resolves against ITS OWN DOM
   * parent. Inside real Banner that parent is StyledBanner (which has the pill radius),
   * but our overlay's parent is StyledBannerIconHost (a plain div with none) — so the
   * inherited value came out as 0 here. Reading the same --border-radius custom property
   * directly (which DOES cascade normally, unlike border-radius itself) fixes that. */
  border-start-start-radius: var(--border-radius, 0.75rem);
  border-end-start-radius: var(--border-radius, 0.75rem);
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 2rem;
  block-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;
