import { MigrationInterface, QueryRunner } from 'typeorm';

export class fotosCT1668106841540 implements MigrationInterface {
  name = 'fotosCT1668106841540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`foto\` ADD \`content_type\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`foto\` DROP COLUMN \`content_type\``,
    );
  }
}
