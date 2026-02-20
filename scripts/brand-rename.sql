-- 1) template table (subject, text, title)
UPDATE dbo.[template]
SET
  subject = REPLACE(REPLACE(REPLACE(REPLACE(CAST(subject AS NVARCHAR(MAX)) COLLATE Latin1_General_CS_AS,
                    'SILICONFORT','SILICONFORT'),'Siliconfort','Siliconfort'),'siliconfort','siliconfort'), N'نقدي', N'سيليكونفورت'),
  [text]  = REPLACE(REPLACE(REPLACE(REPLACE(CAST([text]  AS NVARCHAR(MAX)) COLLATE Latin1_General_CS_AS,
                    'SILICONFORT','SILICONFORT'),'Siliconfort','Siliconfort'),'siliconfort','siliconfort'), N'نقدي', N'سيليكونفورت'),
  title   = REPLACE(REPLACE(REPLACE(REPLACE(CAST(title   AS NVARCHAR(MAX)) COLLATE Latin1_General_CS_AS,
                    'SILICONFORT','SILICONFORT'),'Siliconfort','Siliconfort'),'siliconfort','siliconfort'), N'نقدي', N'سيليكونفورت')
WHERE (subject LIKE '%SILICONFORT%' OR subject LIKE '%Siliconfort%' OR subject LIKE '%siliconfort%' OR subject LIKE N'%نقدي%')
   OR ([text]  LIKE '%SILICONFORT%' OR [text]  LIKE '%Siliconfort%' OR [text]  LIKE '%siliconfort%' OR [text]  LIKE N'%نقدي%')
   OR (title   LIKE '%SILICONFORT%' OR title   LIKE '%Siliconfort%' OR title   LIKE '%siliconfort%' OR title   LIKE N'%نقدي%');



 -- 2) layout table (column name: layout)
UPDATE dbo.[layout]
SET [layout] =
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(CAST([layout] AS NVARCHAR(MAX)) COLLATE Latin1_General_CS_AS,
                  'SILICONFORT', 'SILICONFORT'),
          'Siliconfort', 'Siliconfort'
        ),
        'siliconfort', 'siliconfort'
      ),
      N'نقدي', N'سيليكونفورت'
    )
WHERE [layout] IS NOT NULL
  AND (
       [layout] LIKE '%SILICONFORT%'
    OR [layout] LIKE '%Siliconfort%'
    OR [layout] LIKE '%siliconfort%'
    OR [layout] LIKE N'%نقدي%'
  );



EXEC msdb.dbo.rds_backup_database
    @source_db_name        = 'YourDB',
    @s3_arn_to_backup_to   = 'arn:aws:s3:::YOUR-BUCKET/YourDB_full.bak',
    @overwrite_S3_backup_file = 1,
    @type = 'FULL';
