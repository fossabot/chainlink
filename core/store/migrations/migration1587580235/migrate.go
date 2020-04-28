package migration1587580235

import (
	"github.com/jinzhu/gorm"
)

// Migrate adds the LogConsumption table and adds a uniqueness constraint on the
// combination of block_hash / log_index / consumer_id
func Migrate(tx *gorm.DB) error {
	return tx.Exec(`
	CREATE TABLE "log_consumptions" (
		"id" serial primary key,
		"block_hash" bytea NOT NULL,
		"log_index" integer NOT NULL,
		"consumer_id" uuid REFERENCES job_specs(id) ON DELETE CASCADE NOT NULL,
		"created_at" timestamp without time zone DEFAULT now() NOT NULL
	);

	CREATE UNIQUE INDEX log_consumptions_block_hash_log_index_consumer_id_idx ON log_consumptions ("block_hash", "log_index", "consumer_id");
	`).Error
}
