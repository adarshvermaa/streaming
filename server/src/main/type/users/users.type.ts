export interface UserType {
  name: string;
  publicName?: string;
  email: string;
  username: string;
  password: string;
  isActive?: "active" | "inactive";
  userType?: "student" | "teacher" | "admin" | "superadmin";
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  phone?: string;
  lastSeenAt?: Date;
  isOnline?: boolean;
  externalUrls?: string[];
  deleteAt?: Date;
  updatedAt?: Date;
  isEmailVerifiedAt?: Date;
}
export interface GoogleProfile {
  profile: {
    id: string;
    displayName: string;
    name: {
      familyName: string;
      givenName: string;
    };
    emails: { value: string; verified?: boolean }[];
    photos: { value: string }[];
    provider: string;
    _raw: string;
    _json: {
      sub: string;
      name: string;
      given_name: string;
      family_name: string;
      picture: string;
      email: string;
      email_verified: boolean;
    };
  };
  accessToken: string;
}

export interface GoogleAuth {
  profile: GoogleProfile;
  accessToken: string;
  refreshToken?: string;
}
