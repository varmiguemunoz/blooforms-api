import { MigrationInterface, QueryRunner } from 'typeorm';

export class facUsuariosFix1720632462069 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS fac_usuarios (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fac_usuarios_pkey1 PRIMARY KEY (id),
    CONSTRAINT fac_usuarios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES dim_usuarios(id)
);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE fac_usuarios`);
  }
}
