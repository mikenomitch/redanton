defmodule Danton.BatchNotifier do
  def run do
    Danton.Notification.for_batch_notification() |> Enum.each(&notify_user/1)
  end

  defp notify_user(notification_by_user = {user_id, notifications}) do
    # this should maybe just dispatch a post event if there is only one
    # but we can optimize this later
    posts_waiting = Enum.count(notifications, &(&1.type == "new_post"))
    messages_waiting = Enum.count(notifications, &(&1.type == "new_chat_message"))

    Danton.Notification.mark_pending(notifications)

    single_post = (posts_waiting == 1 && messages_waiting == 0)
    single_msg = (messages_waiting == 1 && posts_waiting == 0)

    if (single_post || single_msg) do
      n = Enum.at(notifications, 0)
      if single_post, do: send_new_post(n), else: send_new_msg(n)
    else
      send_batch_notification(user_id, posts_waiting, messages_waiting)
    end
  end

  defp send_batch_notification(user_id, posts_waiting, messages_waiting) do
    Danton.Communication.send_notification(
      user_id,
      :batch_notification,
      %{
        posts_waiting: posts_waiting,
        messages_waiting: messages_waiting
      }
    )
  end

  defp send_new_post(notification) do
    Danton.Communication.send_notification(
      notification.user_id,
      :new_post,
      Indifferent.access(notification.data)
    )
  end

  defp send_new_msg(notification) do
    Danton.Communication.send_notification(
      notification.user_id,
      :new_chat_message,
      Indifferent.access(notification.data)
    )
  end
end
