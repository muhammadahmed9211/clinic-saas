import { ApiProperty } from '@nestjs/swagger';

export class CreateDashboardWidgetDto {
  @ApiProperty({
    example:
      '{["dashboardWidgets":{"id": "latest_notes","name": "Latest Notes","componentName": "LatestNotes","column": 0}]}',
  })
  widgetJson: string;

  @ApiProperty({ example: 1 })
  roleId: number;
}
