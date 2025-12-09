class HelpRequestMailer < ApplicationMailer
  def help_request(assistant, requester, course)
    @assistant = assistant
    @requester = requester
    @course = course

    mail(
      to: @assistant.email,
      subject: "Help Request for #{course.code}: #{course.name}",
      from: %{"#{@requester.name}" <#{ENV["GMAIL_USERNAME"]}>},
      reply_to: @requester.email
    )
  end
end
