CREATE TYPE "public"."vehicle_fuel_type" AS ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid', 'Hydrogen');--> statement-breakpoint
CREATE TYPE "public"."vehicle_transmission" AS ENUM('Automatic', 'Manual', 'Semi-Automatic');--> statement-breakpoint
CREATE TYPE "public"."vehicle_status_type" AS ENUM('Available', 'Rented', 'Maintenance', 'Retired');--> statement-breakpoint
CREATE TABLE "vehicle_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"status" "vehicle_status_type" NOT NULL,
	"changed_by" text,
	"note" text,
	"status_updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_type" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"year" smallint NOT NULL,
	"vin" text NOT NULL,
	"license_plate" text NOT NULL,
	"color_name" text NOT NULL,
	"color_label" text NOT NULL,
	"color_hex" text NOT NULL,
	"is_brand_new" boolean DEFAULT false NOT NULL,
	"transmission" "vehicle_transmission" NOT NULL,
	"fuel_type" "vehicle_fuel_type" NOT NULL,
	"seats" smallint NOT NULL,
	"doors" smallint NOT NULL,
	"baggage_capacity" smallint NOT NULL,
	"has_ac" boolean DEFAULT true NOT NULL,
	"has_navigation" boolean DEFAULT false NOT NULL,
	"has_bluetooth" boolean DEFAULT true NOT NULL,
	"is_pet_friendly" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vehicle_status" ADD CONSTRAINT "vehicle_status_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_status" ADD CONSTRAINT "vehicle_status_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_vehicle_status_latest" ON "vehicle_status" USING btree ("vehicle_id","status_updated_at");