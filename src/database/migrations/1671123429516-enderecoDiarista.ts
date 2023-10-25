import { MigrationInterface, QueryRunner } from 'typeorm';

export class enderecoDiarista1671123429516 implements MigrationInterface {
  name = 'enderecoDiarista1671123429516';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`endereco_diarista\` (\`id\` int NOT NULL AUTO_INCREMENT, \`logradouro\` varchar(60) NOT NULL, \`numero\` varchar(10) NOT NULL, \`bairro\` varchar(30) NOT NULL, \`complemento\` varchar(255) NULL, \`cep\` varchar(8) NOT NULL, \`cidade\` varchar(30) NOT NULL, \`estado\` varchar(2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuario_api\` ADD \`endereco_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuario_api\` ADD UNIQUE INDEX \`IDX_f4879f5b808cfd80e37001312e\` (\`endereco_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_f4879f5b808cfd80e37001312e\` ON \`usuario_api\` (\`endereco_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuario_api\` ADD CONSTRAINT \`FK_f4879f5b808cfd80e37001312ed\` FOREIGN KEY (\`endereco_id\`) REFERENCES \`endereco_diarista\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`usuario_api\` DROP FOREIGN KEY \`FK_f4879f5b808cfd80e37001312ed\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_f4879f5b808cfd80e37001312e\` ON \`usuario_api\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuario_api\` DROP INDEX \`IDX_f4879f5b808cfd80e37001312e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuario_api\` DROP COLUMN \`endereco_id\``,
    );
    await queryRunner.query(`DROP TABLE \`endereco_diarista\``);
  }
}
