import { MigrationInterface, QueryRunner } from "typeorm";

export class Day15ProductionFields1790070065463 implements MigrationInterface {
    name = 'Day15ProductionFields1790070065463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`slug\` varchar(255) NULL`);
        await queryRunner.query(`
  UPDATE \`categories\`
  SET \`slug\` = CASE
    WHEN \`name\` = 'Clothing' THEN 'clothing'
    WHEN \`name\` = 'Electronics' THEN 'electronics'
    WHEN \`name\` = 'footwear' THEN 'footwear'
    WHEN \`name\` = 'jewellery' THEN 'jewellery'
  END
`);
        await queryRunner.query(
            `ALTER TABLE \`categories\` MODIFY \`slug\` varchar(255) NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`categories\` ADD UNIQUE INDEX \`IDX_420d9f679d41281f282f5bc7d0\` (\`slug\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP INDEX \`IDX_420d9f679d41281f282f5bc7d0\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`slug\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isActive\``);
    }

}
