interface Sprint {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  createdUserId: string;
  createdUserName: string;
  sprintName: string;
  sprintDescription: string;
  startDate: Date;
  endDate: Date;
  isInProgress: boolean;
  isEnded: boolean;
  projectId: string;
}
