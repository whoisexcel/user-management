const { MigrationInterface, QueryRunner } = require("typeorm");

class UpdateIsActiveUsers1720456546295 {
    async up(queryRunner) {
        await queryRunner.query(
            `ALTER TABLE "users" RENAME COLUMN "isActive" TO "isOnline"`,
        );
    }

    async down(queryRunner) {
        await queryRunner.query(
            `ALTER TABLE "users" RENAME COLUMN "isOnline" TO "isActive"`,
        );
    }
}

module.exports = UpdateIsActiveUsers1720456546295;
