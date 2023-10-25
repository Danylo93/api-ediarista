import { MigrationInterface, QueryRunner } from 'typeorm';

export class blacklisttoken1668991007375 implements MigrationInterface {
  name = 'blacklisttoken1668991007375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`token\``);
  }
}
