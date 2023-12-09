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
  sprintName?: string;
  projectId: string;
  projectName?: string;
  estimatedPoints: number;
  status: number;
  priority: number;
  itemType: number;
  assignedUserName?: string;
  assignedUserPic?: string;
  comments?: Comment[] | any[];
  attachments?: Attachment[];
}
interface Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  createdUserId: string;
  createdUserName: string;
  createdUserPic: string;
  comment: string;
  taskId: number;
}
interface Attachment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  attachmentLink: string;
  attachmentPublicId: string;
  attachmentExtension: string;
  taskId: number;
}
