class AddImageIdToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :image_id, :integer
  end

  def self.down
    remove_column :products, :image_id
  end
end
