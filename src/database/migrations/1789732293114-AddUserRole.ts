import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1789732293114 implements MigrationInterface {
    name = 'AddUserRole1789732293114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_4b3073f44f41f0bd7be49cfdc7a\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`role\` enum ('admin', 'vendor', 'customer') NOT NULL DEFAULT 'customer'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_db887c3b31abbbd920e303a0179\` FOREIGN KEY (\`creator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_db887c3b31abbbd920e303a0179\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_4b3073f44f41f0bd7be49cfdc7a\` FOREIGN KEY (\`creator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
