import { MigrationInterface, QueryRunner } from 'typeorm';

export class Postgres1698262580162 implements MigrationInterface {
  name = 'Postgres1698262580162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "foto" ("id" SERIAL NOT NULL, "file_name" character varying NOT NULL, "content_length" integer NOT NULL, "content_type" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "UQ_135b0623c99bc0465eaeaa81a27" UNIQUE ("file_name"), CONSTRAINT "PK_2496ab6b734626c5adcd6c0a37f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cidades_atendidas" ("id" SERIAL NOT NULL, "codigo_ibge" character varying NOT NULL, "cidade" character varying NOT NULL, "estado" character varying NOT NULL, CONSTRAINT "PK_c96f5bf3c1fe916dc247bde2871" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "endereco_diarista" ("id" SERIAL NOT NULL, "logradouro" character varying(60) NOT NULL, "numero" character varying(10) NOT NULL, "bairro" character varying(30) NOT NULL, "complemento" character varying, "cep" character varying(8) NOT NULL, "cidade" character varying(30) NOT NULL, "estado" character varying(2) NOT NULL, CONSTRAINT "PK_c75c2dbf9fd857f331624b2baff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usuario_api" ("id" SERIAL NOT NULL, "nome_completo" character varying NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "tipo_usuario" integer NOT NULL, "cpf" character varying, "nascimento" TIMESTAMP, "telefone" character varying, "reputacao" integer, "chave_pix" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "update_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "foto_usuario" integer, "foto_documento" integer, "endereco_id" integer, CONSTRAINT "UQ_453669c5a5b4d332a67ce1d42ba" UNIQUE ("email"), CONSTRAINT "UQ_8364178fb5011db989bf4a15650" UNIQUE ("cpf"), CONSTRAINT "UQ_4e0e37b7fb53321b8aec5484f3d" UNIQUE ("chave_pix"), CONSTRAINT "REL_401d8e2a36cf32c19a6a9226dc" UNIQUE ("foto_usuario"), CONSTRAINT "REL_336688b5460b598bd991358aed" UNIQUE ("foto_documento"), CONSTRAINT "REL_f4879f5b808cfd80e37001312e" UNIQUE ("endereco_id"), CONSTRAINT "PK_19b6ef4c675375fc576f5e5e91b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "diaria" ("id" SERIAL NOT NULL, "data_atendimento" TIMESTAMP NOT NULL, "tempo_atendimento" integer NOT NULL, "status" integer NOT NULL, "preco" integer NOT NULL, "valor_comissao" integer NOT NULL, "logradouro" character varying NOT NULL, "numero" integer NOT NULL, "bairro" character varying NOT NULL, "complemento" character varying, "cidade" character varying NOT NULL, "estado" character varying NOT NULL, "cep" character varying NOT NULL, "codigo_ibge" character varying NOT NULL, "quantidade_quartos" integer NOT NULL, "quantidade_salas" integer NOT NULL, "quantidade_cozinhas" integer NOT NULL, "quantidade_banheiros" integer NOT NULL, "quantidade_quintais" integer NOT NULL, "quantidade_outros" integer NOT NULL, "observacoes" character varying, "motivo_cancelamento" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cliente_id" integer NOT NULL, "diarista_id" integer, "servico_id" integer NOT NULL, CONSTRAINT "PK_ef5fdea83208ae56faf329b9094" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pagamento" ("id" SERIAL NOT NULL, "status" integer NOT NULL, "valor" integer NOT NULL, "transacao_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "diaria_id" integer NOT NULL, CONSTRAINT "PK_ac81e75b741a26f350c5fb1ff20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "password_reset" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_36e929b98372d961bb63bd4b4e9" UNIQUE ("token"), CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "avaliacao" ("id" SERIAL NOT NULL, "descricao" character varying NOT NULL, "nota" integer NOT NULL, "visibilidade" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "diaria_id" integer NOT NULL, "avaliador_id" integer, "avaliado_id" integer, CONSTRAINT "PK_fd3e156019eb4b68c6c9f746d51" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cidades_atendidas_usuarios" ("usuario_api_id" integer NOT NULL, "cidades_atendidas_id" integer NOT NULL, CONSTRAINT "PK_4a384c52ffbde1a9d507621c9d0" PRIMARY KEY ("usuario_api_id", "cidades_atendidas_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_92ec02c2726dc30411ac8ccd3e" ON "cidades_atendidas_usuarios" ("usuario_api_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_acb5beafbb5aa391950021f149" ON "cidades_atendidas_usuarios" ("cidades_atendidas_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "diaria_candidato" ("diaria_id" integer NOT NULL, "usuario_api_id" integer NOT NULL, CONSTRAINT "PK_9ebdddbc493395a25fd98f177cf" PRIMARY KEY ("diaria_id", "usuario_api_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd9247286d049934078c05d91a" ON "diaria_candidato" ("diaria_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40b864ea45b69ec02acd5c152e" ON "diaria_candidato" ("usuario_api_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "usuario_api" ADD CONSTRAINT "FK_401d8e2a36cf32c19a6a9226dc9" FOREIGN KEY ("foto_usuario") REFERENCES "foto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuario_api" ADD CONSTRAINT "FK_336688b5460b598bd991358aeda" FOREIGN KEY ("foto_documento") REFERENCES "foto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuario_api" ADD CONSTRAINT "FK_f4879f5b808cfd80e37001312ed" FOREIGN KEY ("endereco_id") REFERENCES "endereco_diarista"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaria" ADD CONSTRAINT "FK_c56ef36204dc70df6bd89952fcd" FOREIGN KEY ("cliente_id") REFERENCES "usuario_api"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaria" ADD CONSTRAINT "FK_c6be57059c27ed5e34f66fc6da6" FOREIGN KEY ("diarista_id") REFERENCES "usuario_api"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaria" ADD CONSTRAINT "FK_5e1094dcfc8b8eff8ed9602bdb2" FOREIGN KEY ("servico_id") REFERENCES "servico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pagamento" ADD CONSTRAINT "FK_9497efafd84f3e4328e039d62d9" FOREIGN KEY ("diaria_id") REFERENCES "diaria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "avaliacao" ADD CONSTRAINT "FK_35fe0f22d8f10b876d761b1c9e1" FOREIGN KEY ("diaria_id") REFERENCES "diaria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "avaliacao" ADD CONSTRAINT "FK_0897024fac4a1655bbf90cc6200" FOREIGN KEY ("avaliador_id") REFERENCES "usuario_api"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "avaliacao" ADD CONSTRAINT "FK_945ad0f9f6b9e6cff592e7c6e40" FOREIGN KEY ("avaliado_id") REFERENCES "usuario_api"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cidades_atendidas_usuarios" ADD CONSTRAINT "FK_92ec02c2726dc30411ac8ccd3e4" FOREIGN KEY ("usuario_api_id") REFERENCES "usuario_api"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cidades_atendidas_usuarios" ADD CONSTRAINT "FK_acb5beafbb5aa391950021f1499" FOREIGN KEY ("cidades_atendidas_id") REFERENCES "cidades_atendidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaria_candidato" ADD CONSTRAINT "FK_fd9247286d049934078c05d91af" FOREIGN KEY ("diaria_id") REFERENCES "diaria"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaria_candidato" ADD CONSTRAINT "FK_40b864ea45b69ec02acd5c152e5" FOREIGN KEY ("usuario_api_id") REFERENCES "usuario_api"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "diaria_candidato" DROP CONSTRAINT "FK_40b864ea45b69ec02acd5c152e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaria_candidato" DROP CONSTRAINT "FK_fd9247286d049934078c05d91af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cidades_atendidas_usuarios" DROP CONSTRAINT "FK_acb5beafbb5aa391950021f1499"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cidades_atendidas_usuarios" DROP CONSTRAINT "FK_92ec02c2726dc30411ac8ccd3e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "avaliacao" DROP CONSTRAINT "FK_945ad0f9f6b9e6cff592e7c6e40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "avaliacao" DROP CONSTRAINT "FK_0897024fac4a1655bbf90cc6200"`,
    );
    await queryRunner.query(
      `ALTER TABLE "avaliacao" DROP CONSTRAINT "FK_35fe0f22d8f10b876d761b1c9e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pagamento" DROP CONSTRAINT "FK_9497efafd84f3e4328e039d62d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaria" DROP CONSTRAINT "FK_5e1094dcfc8b8eff8ed9602bdb2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaria" DROP CONSTRAINT "FK_c6be57059c27ed5e34f66fc6da6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaria" DROP CONSTRAINT "FK_c56ef36204dc70df6bd89952fcd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuario_api" DROP CONSTRAINT "FK_f4879f5b808cfd80e37001312ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuario_api" DROP CONSTRAINT "FK_336688b5460b598bd991358aeda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuario_api" DROP CONSTRAINT "FK_401d8e2a36cf32c19a6a9226dc9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_40b864ea45b69ec02acd5c152e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd9247286d049934078c05d91a"`,
    );
    await queryRunner.query(`DROP TABLE "diaria_candidato"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_acb5beafbb5aa391950021f149"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_92ec02c2726dc30411ac8ccd3e"`,
    );
    await queryRunner.query(`DROP TABLE "cidades_atendidas_usuarios"`);
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TABLE "avaliacao"`);
    await queryRunner.query(`DROP TABLE "password_reset"`);
    await queryRunner.query(`DROP TABLE "pagamento"`);
    await queryRunner.query(`DROP TABLE "diaria"`);
    await queryRunner.query(`DROP TABLE "usuario_api"`);
    await queryRunner.query(`DROP TABLE "endereco_diarista"`);
    await queryRunner.query(`DROP TABLE "cidades_atendidas"`);
    await queryRunner.query(`DROP TABLE "foto"`);
  }
}
