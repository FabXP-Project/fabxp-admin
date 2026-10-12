// Server Component for Settings
import { getPlatformSettings } from '@/src/lib/api/settings';
import { SettingsClient } from './SettingsClient';

export const metadata = {
  title: 'Settings | FabXP Admin',
  description: 'Configure platform parameters, security, and notification settings on FabXP.',
};

export default async function SettingsPage() {
  const settings = await getPlatformSettings();
  return <SettingsClient initialSettings={settings} />;
}
