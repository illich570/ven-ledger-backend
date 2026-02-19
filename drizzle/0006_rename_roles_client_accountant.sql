-- Backfill user.role: rename Spanish role values to English (cliente -> client, contador -> accountant)
UPDATE "user" SET role = 'client' WHERE role = 'cliente';
--> statement-breakpoint
UPDATE "user" SET role = 'accountant' WHERE role = 'contador';
