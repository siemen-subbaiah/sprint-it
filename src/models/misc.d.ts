interface Project {
  id: string;
  name: string;
  prefix: string;
  createdUserName: string;
  createdUserId: string;
}

interface PrivateMetadata {
  isAdmin: boolean;
  projects: Project[];
}

interface PrismaUser {
  id: number;
  createdAt: Date;
  invitedUserId: string | null;
  isConfirmed: boolean;
  username: string | null;
  email: string;
  photo: string | null;
  role: string;
  bio: string | null;
  clerkUserId: string | null;
}

type Params = {
  projectId: string;
  projectName: string;
  id?: string;
};
