import { MigrationInterface, QueryRunner } from 'typeorm';

export class fotos1666304004906 implements MigrationInterface {
  name = 'fotos1666304004906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`foto\` (\`id\` int NOT NULL AUTO_INCREMENT, \`file_name\` varchar(255) NOT NULL, \`content_length\` int NOT NULL, \`url\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_135b0623c99bc0465eaeaa81a2\` (\`file_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_135b0623c99bc0465eaeaa81a2\` ON \`foto\``,
    );
    await queryRunner.query(`DROP TABLE \`foto\``);
  }
}
