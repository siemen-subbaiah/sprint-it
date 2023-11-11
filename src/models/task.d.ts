interface Task {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  createdUserId: string;
  createdUserName: string;
  itemName: string;
  itemDescription: string;
  assignedUserId: string;
  isInBacklog: boolean;
  sprintId?: any;
  projectId: string;
  estimatedPoints: number;
  status: number;
  priority: number;
  itemType: number;
}
