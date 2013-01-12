class CreateUploads < ActiveRecord::Migration
  def change
    create_table :uploads do |t|
      t.string :imdbid
      t.string :title
      t.string :director
      t.string :genre
      t.integer :length
      t.text :plot
      t.float :rating
      t.string :releasedate
      t.integer :year
      t.text :cast

      t.timestamps
    end
  end

  def down
    drop_table :uploads
  end
end
