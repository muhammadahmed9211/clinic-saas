export class UserAnswerDTO {
  id: number;
  userId: number;
  questionId: number;
  answerId: number;
  answerText: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  questionName: string;
  questionDescription: string;
  questionType: string;
  questionTitle: string;
  questionGroup: string;
}
