ALTER TABLE "documents" DROP CONSTRAINT "documents_modified_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "holder_id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "modified_by";