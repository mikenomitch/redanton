defmodule Danton.SharedView do
  use Danton.Web, :view

  def show_pager(total_pages) do
    total_pages > 1
  end

  def show_prev(current_page) do
    current_page > 1
  end

  def show_next(current_page, total_pages) do
    current_page < total_pages
  end

  def prev_link(base_url, current_page) do
    base_url <> "?page=" <> Integer.to_string (current_page - 1)
  end

  def next_link(base_url, current_page) do
    base_url <> "?page=" <> Integer.to_string (current_page + 1)
  end

  def footer_class(style) do
    case style do
      :light -> "footer-light"
      :clear -> "footer-clear"
      _ -> "footer-light"
    end
  end
end
