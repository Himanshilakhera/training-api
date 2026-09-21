import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHashedRefreshTokenToUsers1789987560258 implements MigrationInterface {
    name = 'AddHashedRefreshTokenToUsers1789987560258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`currentHashedRefreshToken\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`currentHashedRefreshToken\``);
    }

}
