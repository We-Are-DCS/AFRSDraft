export interface Platform {
  id: string;
  label: string;
  icon: string;
  color: string;
  feedLabel: string;
  adFormat: 'vertical-video' | 'feed-post' | 'story' | 'professional' | 'preroll' | 'snap-ad' | 'whatsapp-channel';
  cta: string;
  adNote: string;
  channelCode: string;
  url: string;
}

export const platforms: Platform[] = [
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: '🎵',
    color: '#010101',
    feedLabel: 'For You',
    adFormat: 'vertical-video',
    cta: 'Learn more →',
    adNote: 'Sponsored · TikTok for Business',
    channelCode: 'TIKTOK',
    url: 'tiktok.com/foryou · #ArmedForces · Sponsored',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: '📘',
    color: '#1877f2',
    feedLabel: 'News Feed',
    adFormat: 'feed-post',
    cta: 'Learn More',
    adNote: 'Sponsored · Meta',
    channelCode: 'FACEBOOK',
    url: 'facebook.com/feed · Sponsored · Meta Ads',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: '📷',
    color: '#e1306c',
    feedLabel: 'Reels',
    adFormat: 'story',
    cta: 'Swipe Up →',
    adNote: 'Sponsored · Instagram',
    channelCode: 'INSTAGRAM',
    url: 'instagram.com/reels · Sponsored · Instagram Ads',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: '💼',
    color: '#0a66c2',
    feedLabel: 'Feed',
    adFormat: 'professional',
    cta: 'Reserve my place',
    adNote: 'Promoted · LinkedIn',
    channelCode: 'LINKEDIN',
    url: 'linkedin.com/feed · Promoted · LinkedIn Campaign Manager',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: '▶',
    color: '#ff0000',
    feedLabel: 'Shorts',
    adFormat: 'preroll',
    cta: 'Visit site',
    adNote: 'Ad · YouTube · Skip in 5s',
    channelCode: 'YOUTUBE',
    url: 'youtube.com/shorts · Ad · Google Ads',
  },
  {
    id: 'snapchat',
    label: 'Snapchat',
    icon: '👻',
    color: '#FFFC00',
    feedLabel: 'Stories',
    adFormat: 'snap-ad',
    cta: 'Swipe Up →',
    adNote: 'Sponsored · Snap Ads',
    channelCode: 'SNAPCHAT',
    url: 'snapchat.com/discover · Snap Ads Manager · Sponsored',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
    feedLabel: 'Channels',
    adFormat: 'whatsapp-channel',
    cta: 'Register Interest →',
    adNote: 'Via WhatsApp Business API',
    channelCode: 'WHATSAPP',
    url: 'web.whatsapp.com/channels · WhatsApp Business API',
  },
];

export const defaultPlatformByPersona: Record<string, string> = {
  james: 'tiktok',
  sarah: 'linkedin',
  george: 'facebook',
};
