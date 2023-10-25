import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordReset1685069043258 implements MigrationInterface {
    name = 'PasswordReset1685069043258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`password_reset\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_36e929b98372d961bb63bd4b4e\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_36e929b98372d961bb63bd4b4e\` ON \`password_reset\``);
        await queryRunner.query(`DROP TABLE \`password_reset\``);
    }

}
