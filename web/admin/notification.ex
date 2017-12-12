defmodule Danton.ExAdmin.Notification do
  use ExAdmin.Register

  register_resource Danton.Notification do

    index do
      selectable_column()

      column :id
      column :user_id
      column :type
      column :status
      actions()     # display the default actions column
    end

    form contact do
      inputs do
        input contact, :user_id
        input contact, :type
        input contact, :status
      end
    end
  end
end
