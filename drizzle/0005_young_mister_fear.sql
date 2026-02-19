CREATE TABLE "clients_accountants" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"accountant_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"modified_at" timestamp with time zone,
	"created_by" varchar(255) NOT NULL,
	"modified_by" varchar(255),
	"is_active" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" varchar(255) NOT NULL,
	"modified_by" varchar(255),
	"is_active" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"modified_at" timestamp with time zone,
	"is_active" integer DEFAULT 1 NOT NULL,
	"category_id" integer NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"modified_by" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "type_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "key_name" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "holder_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "created_by" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "modified_by" varchar(255);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "is_active" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "clients_accountants" ADD CONSTRAINT "clients_accountants_client_id_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients_accountants" ADD CONSTRAINT "clients_accountants_accountant_id_user_id_fk" FOREIGN KEY ("accountant_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients_accountants" ADD CONSTRAINT "clients_accountants_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients_accountants" ADD CONSTRAINT "clients_accountants_modified_by_user_id_fk" FOREIGN KEY ("modified_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_documents" ADD CONSTRAINT "category_documents_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_documents" ADD CONSTRAINT "category_documents_modified_by_user_id_fk" FOREIGN KEY ("modified_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_documents" ADD CONSTRAINT "type_documents_category_id_category_documents_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_documents" ADD CONSTRAINT "type_documents_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_documents" ADD CONSTRAINT "type_documents_modified_by_user_id_fk" FOREIGN KEY ("modified_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "id_clients_accountants_idx" ON "clients_accountants" USING btree ("id");--> statement-breakpoint
CREATE INDEX "client_id_idx" ON "clients_accountants" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "accountant_id_idx" ON "clients_accountants" USING btree ("accountant_id");--> statement-breakpoint
CREATE INDEX "id_category_documents_idx" ON "category_documents" USING btree ("id");--> statement-breakpoint
CREATE INDEX "name_idx" ON "category_documents" USING btree ("name");--> statement-breakpoint
CREATE INDEX "id_type_document_idx" ON "type_documents" USING btree ("id");--> statement-breakpoint
CREATE INDEX "category_document_id_idx" ON "type_documents" USING btree ("category_id");--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_type_id_type_documents_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."type_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_modified_by_user_id_fk" FOREIGN KEY ("modified_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_category_id_category_documents_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "id_idx" ON "documents" USING btree ("id");--> statement-breakpoint
CREATE INDEX "holder_id_idx" ON "documents" USING btree ("holder_id");--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "name";