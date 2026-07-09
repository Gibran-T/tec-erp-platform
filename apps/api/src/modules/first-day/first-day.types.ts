export interface MessageStateRecord {
  readonly employeeId: string;
  readonly messageKey: string;
  readonly readAt: Date;
}

export interface TaskStateRecord {
  readonly employeeId: string;
  readonly taskKey: string;
  readonly completedAt: Date;
}

export interface FirstDayStateRepository {
  findMessageState(employeeId: string, messageKey: string): Promise<MessageStateRecord | null>;
  findMessageStates(employeeId: string): Promise<readonly MessageStateRecord[]>;
  createMessageState(
    employeeId: string,
    messageKey: string,
    readAt: Date,
  ): Promise<MessageStateRecord>;
  findTaskState(employeeId: string, taskKey: string): Promise<TaskStateRecord | null>;
  findTaskStates(employeeId: string): Promise<readonly TaskStateRecord[]>;
  createTaskState(
    employeeId: string,
    taskKey: string,
    completedAt: Date,
  ): Promise<TaskStateRecord>;
}
