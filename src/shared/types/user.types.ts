export interface User {
  id: number;
  email: string;
  userRole?: number;
  ownerRequestStatus?: number;
  status?: string;
  profile?: {
    fullName: string;
    phoneNumber: string;
    avatarUrl?: string;
  } | null;
}
