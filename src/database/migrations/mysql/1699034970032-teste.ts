import { MigrationInterface, QueryRunner } from "typeorm";

export class Teste1699034970032 implements MigrationInterface {
    name = 'Teste1699034970032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pagamento\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` int NOT NULL, \`valor\` int NOT NULL, \`transacao_id\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`diaria_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`endereco_diarista\` CHANGE \`complemento\` \`complemento\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` DROP FOREIGN KEY \`FK_401d8e2a36cf32c19a6a9226dc9\``);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` DROP FOREIGN KEY \`FK_336688b5460b598bd991358aeda\``);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` DROP FOREIGN KEY \`FK_f4879f5b808cfd80e37001312ed\``);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`cpf\` \`cpf\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`nascimento\` \`nascimento\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`telefone\` \`telefone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`reputacao\` \`reputacao\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`chave_pix\` \`chave_pix\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`foto_usuario\` \`foto_usuario\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`foto_documento\` \`foto_documento\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`endereco_id\` \`endereco_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`diaria\` DROP FOREIGN KEY \`FK_c6be57059c27ed5e34f66fc6da6\``);
        await queryRunner.query(`ALTER TABLE \`diaria\` CHANGE \`complemento\` \`complemento\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`diaria\` CHANGE \`observacoes\` \`observacoes\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`diaria\` CHANGE \`motivo_cancelamento\` \`motivo_cancelamento\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`diaria\` CHANGE \`diarista_id\` \`diarista_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` DROP FOREIGN KEY \`FK_0897024fac4a1655bbf90cc6200\``);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` DROP FOREIGN KEY \`FK_945ad0f9f6b9e6cff592e7c6e40\``);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` CHANGE \`avaliador_id\` \`avaliador_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` CHANGE \`avaliado_id\` \`avaliado_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` ADD CONSTRAINT \`FK_401d8e2a36cf32c19a6a9226dc9\` FOREIGN KEY (\`foto_usuario\`) REFERENCES \`foto\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` ADD CONSTRAINT \`FK_336688b5460b598bd991358aeda\` FOREIGN KEY (\`foto_documento\`) REFERENCES \`foto\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` ADD CONSTRAINT \`FK_f4879f5b808cfd80e37001312ed\` FOREIGN KEY (\`endereco_id\`) REFERENCES \`endereco_diarista\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diaria\` ADD CONSTRAINT \`FK_c6be57059c27ed5e34f66fc6da6\` FOREIGN KEY (\`diarista_id\`) REFERENCES \`usuario_api\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diaria\` ADD CONSTRAINT \`FK_5e1094dcfc8b8eff8ed9602bdb2\` FOREIGN KEY (\`servico_id\`) REFERENCES \`servico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` ADD CONSTRAINT \`FK_0897024fac4a1655bbf90cc6200\` FOREIGN KEY (\`avaliador_id\`) REFERENCES \`usuario_api\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` ADD CONSTRAINT \`FK_945ad0f9f6b9e6cff592e7c6e40\` FOREIGN KEY (\`avaliado_id\`) REFERENCES \`usuario_api\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pagamento\` ADD CONSTRAINT \`FK_9497efafd84f3e4328e039d62d9\` FOREIGN KEY (\`diaria_id\`) REFERENCES \`diaria\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diaria_candidato\` ADD CONSTRAINT \`FK_fd9247286d049934078c05d91af\` FOREIGN KEY (\`diaria_id\`) REFERENCES \`diaria\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`diaria_candidato\` ADD CONSTRAINT \`FK_40b864ea45b69ec02acd5c152e5\` FOREIGN KEY (\`usuario_api_id\`) REFERENCES \`usuario_api\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`diaria_candidato\` DROP FOREIGN KEY \`FK_40b864ea45b69ec02acd5c152e5\``);
        await queryRunner.query(`ALTER TABLE \`diaria_candidato\` DROP FOREIGN KEY \`FK_fd9247286d049934078c05d91af\``);
        await queryRunner.query(`ALTER TABLE \`pagamento\` DROP FOREIGN KEY \`FK_9497efafd84f3e4328e039d62d9\``);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` DROP FOREIGN KEY \`FK_945ad0f9f6b9e6cff592e7c6e40\``);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` DROP FOREIGN KEY \`FK_0897024fac4a1655bbf90cc6200\``);
        await queryRunner.query(`ALTER TABLE \`diaria\` DROP FOREIGN KEY \`FK_5e1094dcfc8b8eff8ed9602bdb2\``);
        await queryRunner.query(`ALTER TABLE \`diaria\` DROP FOREIGN KEY \`FK_c6be57059c27ed5e34f66fc6da6\``);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` DROP FOREIGN KEY \`FK_f4879f5b808cfd80e37001312ed\``);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` DROP FOREIGN KEY \`FK_336688b5460b598bd991358aeda\``);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` DROP FOREIGN KEY \`FK_401d8e2a36cf32c19a6a9226dc9\``);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` CHANGE \`avaliado_id\` \`avaliado_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` CHANGE \`avaliador_id\` \`avaliador_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` ADD CONSTRAINT \`FK_945ad0f9f6b9e6cff592e7c6e40\` FOREIGN KEY (\`avaliado_id\`) REFERENCES \`usuario_api\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`avaliacao\` ADD CONSTRAINT \`FK_0897024fac4a1655bbf90cc6200\` FOREIGN KEY (\`avaliador_id\`) REFERENCES \`usuario_api\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diaria\` CHANGE \`diarista_id\` \`diarista_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`diaria\` CHANGE \`motivo_cancelamento\` \`motivo_cancelamento\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`diaria\` CHANGE \`observacoes\` \`observacoes\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`diaria\` CHANGE \`complemento\` \`complemento\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`diaria\` ADD CONSTRAINT \`FK_c6be57059c27ed5e34f66fc6da6\` FOREIGN KEY (\`diarista_id\`) REFERENCES \`usuario_api\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`endereco_id\` \`endereco_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`foto_documento\` \`foto_documento\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`foto_usuario\` \`foto_usuario\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`chave_pix\` \`chave_pix\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`reputacao\` \`reputacao\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`telefone\` \`telefone\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`nascimento\` \`nascimento\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` CHANGE \`cpf\` \`cpf\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` ADD CONSTRAINT \`FK_f4879f5b808cfd80e37001312ed\` FOREIGN KEY (\`endereco_id\`) REFERENCES \`endereco_diarista\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` ADD CONSTRAINT \`FK_336688b5460b598bd991358aeda\` FOREIGN KEY (\`foto_documento\`) REFERENCES \`foto\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuario_api\` ADD CONSTRAINT \`FK_401d8e2a36cf32c19a6a9226dc9\` FOREIGN KEY (\`foto_usuario\`) REFERENCES \`foto\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`endereco_diarista\` CHANGE \`complemento\` \`complemento\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`pagamento\``);
    }

}
