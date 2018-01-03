defmodule Danton.TagView do
  use Danton.Web, :view

  def post_count_string(tag) do
    case tag.post_count do
      1 -> Integer.to_string(tag.post_count) <> " post"
      _ -> Integer.to_string(tag.post_count) <> " posts"
    end
  end
end
