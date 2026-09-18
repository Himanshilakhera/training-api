import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatorToProducts1790000000000 implements MigrationInterface {
    name = 'AddCreatorToProducts1790000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`creator_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_4b3073f44f41f0bd7be49cfdc7a\` FOREIGN KEY (\`creator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_4b3073f44f41f0bd7be49cfdc7a\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`creator_id\``);
    }
}
