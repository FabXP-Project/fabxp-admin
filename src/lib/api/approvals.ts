import { serverDb } from './db';
import { ApprovalItem } from '@/src/types/dashboard';

export async function getApprovals(options?: {
  category?: string;
  search?: string;
}): Promise<{
  approvals: ApprovalItem[];
  approvedIds: string[];
  rejectedIds: string[];
}> {
  let list = serverDb.getApprovals();

  if (options?.category && options.category !== 'All') {
    list = list.filter((item) => item.category === options.category);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    );
  }

  return {
    approvals: list,
    approvedIds: serverDb.getApprovedIds(),
    rejectedIds: serverDb.getRejectedIds(),
  };
}

export async function approveListing(id: string) {
  return serverDb.approveListing(id);
}

export async function rejectListing(id: string) {
  return serverDb.rejectListing(id);
}

export async function undoApproval(id: string) {
  return serverDb.undoApproval(id);
}

export async function approveAllListings() {
  return serverDb.approveAllListings();
}
