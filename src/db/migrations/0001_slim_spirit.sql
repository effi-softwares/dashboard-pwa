CREATE TYPE "public"."vehicle_fuel_type" AS ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid', 'Hydrogen');--> statement-breakpoint
CREATE TYPE "public"."vehicle_transmission" AS ENUM('Automatic', 'Manual', 'Semi-Automatic');--> statement-breakpoint
CREATE TYPE "public"."vehicle_status_type" AS ENUM('Available', 'Rented', 'Maintenance', 'Retired');--> statement-breakpoint
CREATE TABLE "vehicle_status" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vehicle_status_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vehicle_id" integer NOT NULL,
	"status" "vehicle_status_type" NOT NULL,
	"changed_by" text,
	"note" text,
	"status_updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vehicles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"year" smallint NOT NULL,
	"vin" text NOT NULL,
	"license_plate" text NOT NULL,
	"color_name" text NOT NULL,
	"color_hex" text NOT NULL,
	"is_brand_new" boolean DEFAULT false NOT NULL,
	"transmission" "vehicle_transmission" NOT NULL,
	"fuel_type" "vehicle_fuel_type" NOT NULL,
	"odometer_reading" integer NOT NULL,
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
CREATE INDEX "idx_vehicle_status_latest" ON "vehicle_status" USING btree ("vehicle_id","status_updated_at");