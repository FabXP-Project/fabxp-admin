'use server';

import { revalidatePath } from 'next/cache';
import {
  approveListing,
  rejectListing,
  undoApproval,
  approveAllListings,
} from '@/src/lib/api/approvals';
import { approvePayout } from '@/src/lib/api/payouts';
import {
  updateCommissionDefaults,
  updateCommissionOverride,
  addCommissionOverride,
} from '@/src/lib/api/commission';
import {
  addUser,
  toggleUserStatus,
  updateUser,
} from '@/src/lib/api/users';
import { updatePlatformSettings } from '@/src/lib/api/settings';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/src/lib/api/notifications';
import {
  CommissionDefaults,
  PlatformSettings,
  UserManagementItem,
} from '@/src/types/dashboard';

export async function approveListingAction(id: string, title?: string) {
  const result = await approveListing(id);
  revalidatePath('/');
  revalidatePath('/approvals');
  return { success: true, id, message: `Approved "${title || id}" successfully` };
}

export async function rejectListingAction(id: string, title?: string) {
  const result = await rejectListing(id);
  revalidatePath('/');
  revalidatePath('/approvals');
  return { success: true, id, message: `Rejected "${title || id}"` };
}

export async function undoApprovalAction(id: string) {
  const result = await undoApproval(id);
  revalidatePath('/');
  revalidatePath('/approvals');
  return { success: true, id, message: 'Listing reset to pending' };
}

export async function approveAllListingsAction() {
  const result = await approveAllListings();
  revalidatePath('/');
  revalidatePath('/approvals');
  return { success: true, count: result.count, message: 'All pending listings approved!' };
}

export async function approvePayoutAction(id: string, provider?: string, amount?: string) {
  const result = await approvePayout(id);
  revalidatePath('/payouts');
  return {
    success: true,
    data: result,
    message: provider && amount ? `Payout of ${amount} approved for ${provider}!` : 'Payout approved',
  };
}

export async function saveCommissionDefaultsAction(defaults: CommissionDefaults) {
  const result = await updateCommissionDefaults(defaults);
  revalidatePath('/commission');
  return { success: true, data: result, message: 'Default category commission rates saved successfully!' };
}

export async function updateOverrideAction(id: string, rate: number) {
  const result = await updateCommissionOverride(id, rate);
  revalidatePath('/commission');
  return { success: true, data: result, message: `Updated custom rate to ${rate}%` };
}

export async function addOverrideAction(partner: string, category: string, rate: number) {
  const result = await addCommissionOverride(partner, category, rate);
  revalidatePath('/commission');
  return { success: true, data: result, message: `Added custom override for ${partner} (${rate}%)` };
}

export async function saveSettingsAction(settings: PlatformSettings) {
  const result = await updatePlatformSettings(settings);
  revalidatePath('/settings');
  return { success: true, data: result, message: 'Platform settings saved successfully!' };
}

export async function addUserAction(userData: Omit<UserManagementItem, 'id' | 'listingsCount'>) {
  const newUser = await addUser(userData);
  revalidatePath('/users');
  return {
    success: true,
    data: newUser,
    message: `Added new ${userData.role}: ${userData.name}`,
  };
}

export async function toggleUserStatusAction(id: string) {
  const updated = await toggleUserStatus(id);
  revalidatePath('/users');
  return {
    success: true,
    data: updated,
    message: updated ? `Account for ${updated.name} is now ${updated.status}` : 'Status updated',
  };
}

export async function updateUserAction(id: string, updates: Partial<UserManagementItem>) {
  const updated = await updateUser(id, updates);
  revalidatePath('/users');
  return { success: true, data: updated, message: 'User account updated successfully' };
}

export async function markNotificationReadAction(id: string) {
  const result = await markNotificationAsRead(id);
  revalidatePath('/notifications');
  return { success: true, data: result };
}

export async function markAllNotificationsReadAction() {
  const result = await markAllNotificationsAsRead();
  revalidatePath('/notifications');
  return { success: true, data: result, message: 'All notifications marked as read' };
}
