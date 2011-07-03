class Addwebsitetoproducts < ActiveRecord::Migration
  def self.up
    add_column :products, :website, :string

  end

  def self.down
    remove_column :products, :website
  end
end
