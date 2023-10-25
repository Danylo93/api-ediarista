import { MigrationInterface, QueryRunner } from 'typeorm';

export class pagamentos1673881250468 implements MigrationInterface {
  name = 'pagamentos1673881250468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`pagamento\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` int NOT NULL, \`valor\` int NOT NULL, \`transacao_id\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`diaria_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pagamento\` ADD CONSTRAINT \`FK_9497efafd84f3e4328e039d62d9\` FOREIGN KEY (\`diaria_id\`) REFERENCES \`diaria\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pagamento\` DROP FOREIGN KEY \`FK_9497efafd84f3e4328e039d62d9\``,
    );
    await queryRunner.query(`DROP TABLE \`pagamento\``);
  }
}
