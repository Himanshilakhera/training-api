import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderTimestamps1789459392067 implements MigrationInterface {
    name = 'AddOrderTimestamps1789459392067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('PENDING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('PENDING', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`createdAt\``);
    }

}
