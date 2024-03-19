-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'INCOMPLETE', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "Rights" AS ENUM ('CREATE', 'EDIT', 'DELETE', 'ADD_MEMBER', 'EDIT_MEMBER', 'DELETE_MEMBER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "nickname" TEXT,
    "password" TEXT NOT NULL,
    "work_interval" INTEGER DEFAULT 50,
    "break_interval" INTEGER DEFAULT 18,
    "intervals_count" INTEGER DEFAULT 7,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_role" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "rights" "Rights"[] DEFAULT ARRAY[]::"Rights"[],

    CONSTRAINT "project_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_member" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role_id" TEXT NOT NULL,
    "project_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "project_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "image_path" TEXT DEFAULT '',
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "priority" "Priority" DEFAULT 'LOW',
    "status" "Status" DEFAULT 'INCOMPLETE',
    "image_path" TEXT DEFAULT '/default',
    "deadline" TIMESTAMP(3) NOT NULL,
    "color" TEXT,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_block" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "duration" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "time_block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pomodoro_session" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "pomodoro_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pomodoro_round" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "total_seconds" INTEGER NOT NULL,
    "is_completed" BOOLEAN DEFAULT false,
    "pomodoro_session_id" TEXT NOT NULL,

    CONSTRAINT "pomodoro_round_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user" USING HASH ("email");

-- CreateIndex
CREATE UNIQUE INDEX "project_role_name_key" ON "project_role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "project_member_role_id_key" ON "project_member"("role_id");

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "project_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_block" ADD CONSTRAINT "time_block_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pomodoro_session" ADD CONSTRAINT "pomodoro_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pomodoro_round" ADD CONSTRAINT "pomodoro_round_pomodoro_session_id_fkey" FOREIGN KEY ("pomodoro_session_id") REFERENCES "pomodoro_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
