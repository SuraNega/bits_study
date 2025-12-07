# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_12_04_172954) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "assistant_reviews", force: :cascade do |t|
    t.integer "assistant_id", null: false
    t.integer "user_id", null: false
    t.integer "rating"
    t.text "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assistant_id"], name: "index_assistant_reviews_on_assistant_id"
    t.index ["user_id"], name: "index_assistant_reviews_on_user_id"
  end

  create_table "assistantcourses", force: :cascade do |t|
    t.integer "assistant_id", null: false
    t.integer "course_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.time "assigned_time"
    t.boolean "special", default: false
    t.index ["assistant_id"], name: "index_assistantcourses_on_assistant_id"
    t.index ["course_id"], name: "index_assistantcourses_on_course_id"
  end

  create_table "connections", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "assistant_id", null: false
    t.string "status"
    t.string "telegram_username"
    t.text "course_ids"
    t.text "problem_description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "rating"
    t.text "review"
    t.datetime "reviewed_at"
    t.index ["assistant_id"], name: "index_connections_on_assistant_id"
    t.index ["user_id"], name: "index_connections_on_user_id"
  end

  create_table "courses", force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.string "year"
    t.integer "semester"
    t.string "description"
    t.integer "credit_hour"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "academic_year"
    t.string "telegram_username"
    t.text "bio"
    t.string "activity_status"
    t.text "profile_picture_data"
    t.text "roles"
    t.string "active_role"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "assistant_reviews", "users"
  add_foreign_key "assistant_reviews", "users", column: "assistant_id"
  add_foreign_key "assistantcourses", "courses"
  add_foreign_key "assistantcourses", "users", column: "assistant_id"
  add_foreign_key "connections", "users"
  add_foreign_key "connections", "users", column: "assistant_id"
end
