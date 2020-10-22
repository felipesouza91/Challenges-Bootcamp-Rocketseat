import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCaterory1599151836379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // For Postgress 12 or high install uuid generated funcions
    await queryRunner.query('CREATE extension IF NOT EXISTS "uuid-ossp"');
    // Application querys
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories');
  }
}
