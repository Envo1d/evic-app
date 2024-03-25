/*
  Warnings:

  - The values [LOW,MEDIUM,HIGH] on the enum `Priority` will be removed. If these variants are still used in the database, this will fail.
  - The values [CREATE,EDIT,DELETE,ADD_MEMBER,EDIT_MEMBER,DELETE_MEMBER] on the enum `Rights` will be removed. If these variants are still used in the database, this will fail.
  - The values [COMPLETED,INCOMPLETE,EXPIRED,CANCELED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Priority_new" AS ENUM ('low', 'medium', 'high');
ALTER TABLE "task" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "task" ALTER COLUMN "priority" TYPE "Priority_new" USING ("priority"::text::"Priority_new");
ALTER TYPE "Priority" RENAME TO "Priority_old";
ALTER TYPE "Priority_new" RENAME TO "Priority";
DROP TYPE "Priority_old";
ALTER TABLE "task" ALTER COLUMN "priority" SET DEFAULT 'low';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Rights_new" AS ENUM ('create', 'edit', 'delete', 'add_member', 'edit_member', 'delete_member');
ALTER TABLE "project_role" ALTER COLUMN "rights" DROP DEFAULT;
ALTER TABLE "project_role" ALTER COLUMN "rights" TYPE "Rights_new"[] USING ("rights"::text::"Rights_new"[]);
ALTER TYPE "Rights" RENAME TO "Rights_old";
ALTER TYPE "Rights_new" RENAME TO "Rights";
DROP TYPE "Rights_old";
ALTER TABLE "project_role" ALTER COLUMN "rights" SET DEFAULT ARRAY[]::"Rights"[];
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('completed', 'incomplete', 'expired', 'canceled');
ALTER TABLE "task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "task" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "task" ALTER COLUMN "status" SET DEFAULT 'incomplete';
COMMIT;

-- AlterTable
ALTER TABLE "task" ALTER COLUMN "priority" SET DEFAULT 'low',
ALTER COLUMN "status" SET DEFAULT 'incomplete';

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "break_interval" SET DEFAULT 10;
