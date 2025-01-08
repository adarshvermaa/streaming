export interface UserType {
    name?: string;
    publicName?: string
    email?: string;
    username?: string;
    password?: string;
    isActive?: "active" | "inactive";
    userType?: "student" | "teacher" | "admin" | 'superadmin'
    avatarUrl?: string;
    coverUrl?: string;
    bio?: string;
    phone?: string;
    lastSeenAt?: Date;
    isOnline?: boolean;
    externalUrl?: string[];
    deleteAt?: Date;
    updatedAt?: Date;
}
