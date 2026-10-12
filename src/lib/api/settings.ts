import { serverDb } from './db';
import { PlatformSettings } from '@/src/types/dashboard';

export async function getPlatformSettings(): Promise<PlatformSettings> {
  return serverDb.getSettings();
}

export async function updatePlatformSettings(
  settings: PlatformSettings
): Promise<PlatformSettings> {
  return serverDb.updateSettings(settings);
}
