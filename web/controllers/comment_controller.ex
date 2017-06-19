defmodule Danton.CommentController do
  use Danton.Web, :controller

  alias Danton.Comment

  def index(conn,  %{"post_id" => post_id}) do
    comments = Repo.all(
      from c in Comment,
      where: c.post_id == ^post_id,
      select: c
    )

    render(conn, "index.html", comments: comments, post_id: post_id)
  end

  def new(conn, %{"post_id" => post_id}) do
    changeset = Comment.changeset(%Comment{})
    render(conn, "new.html", changeset: changeset, post_id: post_id)
  end

  def create(conn, %{"comment" => comment_params, "post_id" => post_id}) do
    # this should support comments as well
    post = Danton.Repo.get(Danton.Comment, post_id)

     # extract somehow
    %Danton.Comment{}
      |> Danton.Comment.changeset(comment_params)
      |> Ecto.Changeset.put_assoc(:post, post)
      |> Danton.Repo.insert()
      |> case do
      {:ok, _comment} ->
        conn
        |> put_flash(:info, "Comment created successfully.")
        |> redirect(to: post_comment_path(conn, :index, post_id))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    comment = Repo.get!(Comment, id)
    render(conn, "show.html", comment: comment)
  end

  def edit(conn, %{"id" => id}) do
    comment = Repo.get!(Comment, id)
    changeset = Comment.changeset(comment)
    render(conn, "edit.html", comment: comment, changeset: changeset)
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Repo.get!(Comment, id)
    changeset = Comment.changeset(comment, comment_params)

    case Repo.update(changeset) do
      {:ok, comment} ->
        conn
        |> put_flash(:info, "Comment updated successfully.")
        |> redirect(to: comment_path(conn, :show, comment))
      {:error, changeset} ->
        render(conn, "edit.html", comment: comment, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Repo.get!(Comment, id)
    post_id = comment.post_id

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(comment)

    conn
    |> put_flash(:info, "Comment deleted successfully.")
    |> redirect(to: post_comment_path(conn, :index, post_id))
  end
end
