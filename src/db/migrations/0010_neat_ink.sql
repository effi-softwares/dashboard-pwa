CREATE TYPE "public"."vehicle_media_role" AS ENUM('front', 'back', 'interior');--> statement-breakpoint
CREATE TABLE "vehicle_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"role" "vehicle_media_role" NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vehicle_media" ADD CONSTRAINT "vehicle_media_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_media" ADD CONSTRAINT "vehicle_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_vehicle_media_vehicle" ON "vehicle_media" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_vehicle_media_media" ON "vehicle_media" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "idx_vehicle_media_vehicle_role" ON "vehicle_media" USING btree ("vehicle_id","role");