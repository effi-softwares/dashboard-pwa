CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('vehicle', 'rental', 'user');--> statement-breakpoint
CREATE TYPE "public"."media_role" AS ENUM('primary', 'gallery', 'document');--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "media_type" NOT NULL,
	"provider" text DEFAULT 'blob' NOT NULL,
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"mime" text NOT NULL,
	"size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"blur_data_url" text,
	"checksum" text,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_id" uuid NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"role" "media_role" DEFAULT 'gallery' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_links" ADD CONSTRAINT "media_links_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_media_url" ON "media" USING btree ("url");--> statement-breakpoint
CREATE INDEX "idx_media_created_by" ON "media" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_media_links_entity" ON "media_links" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_media_links_media" ON "media_links" USING btree ("media_id");