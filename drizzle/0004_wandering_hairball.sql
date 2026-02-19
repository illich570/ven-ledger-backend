ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" varchar(512);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp;