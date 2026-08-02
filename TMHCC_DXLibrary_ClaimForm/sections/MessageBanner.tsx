import { Banner, HTML, Icon } from '@pega/cosmos-react-core';
import type { BannerProps } from '@pega/cosmos-react-core';
import { isHtmlContent } from '../utils/htmlContentUtils';

interface MessageBannerProps {
  variant: BannerProps['variant'];
  message: string;
  className?: string;
}

const VARIANT_ICON: Record<NonNullable<BannerProps['variant']>, string> = {
  urgent: 'warn-solid',
  warning: 'diamond-minus',
  success: 'check',
  info: 'information-solid',
  ai: 'polaris-solid'
};

/**
 * Pega-sourced messages (validation/error rules) can be plain text or
 * HTML-formatted. Cosmos's own Banner only ever renders `messages` as plain,
 * escaped text (its type is string-only and it accepts no children), so an
 * HTML message would show up as literal tag characters. Route HTML content
 * through Cosmos's own sanitizing HTML component instead, inside a banner
 * shell styled to match.
 */
function MessageBanner({ variant, message, className }: MessageBannerProps) {
  if (!isHtmlContent(message)) {
    return <Banner className={className} variant={variant} messages={[message]} />;
  }

  return (
    <div className={`claim-form__html-banner claim-form__html-banner--${variant} ${className ?? ''}`}>
      <Icon name={VARIANT_ICON[variant]} />
      <HTML className='claim-form__html-banner-content' content={message} />
    </div>
  );
}

export default MessageBanner;
