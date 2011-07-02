class ApiController < ApplicationController
   respond_to :json

   def get_items 
      # for each image sent, return all its items   
      # @client = params[:_json]
      return if params[:_json].blank?
      @images = params[:_json]

      # return if Client.find_by_url(@client['url'])
      # send back 
      @stores = []

      @images.each_with_index do |image,index|
        if Image.find_by_url(image[:url]).nil?
          Image.new(:url => image[:url])
          @stores << nil
        else
          @stores << Image.find_by_url(image[:url]).products
        end
      end
      debugger
      responds_with(@stores)
      
   end
  
end
