<?php

namespace App\Notifications;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    protected $application;
    protected $oldStatus;
    protected $comment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Application $application, string $oldStatus, ?string $comment = null)
    {
        $this->application = $application;
        $this->oldStatus = $oldStatus;
        $this->comment = $comment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusMessages = [
            'submitted' => 'Your application has been successfully submitted!',
            'under_review' => 'Your application is now under review.',
            'documents_requested' => 'Additional documents are required for your application.',
            'approved' => 'Congratulations! Your application has been approved!',
            'rejected' => 'We regret to inform you that your application has not been approved.',
        ];

        $message = $statusMessages[$this->application->status] ?? 'Your application status has been updated.';

        $mail = (new MailMessage)
            ->subject('Application Status Update - ' . $this->application->application_number)
            ->greeting('Dear ' . $notifiable->name . ',')
            ->line($message)
            ->line('Application Number: ' . $this->application->application_number)
            ->line('Program: ' . $this->application->program->name)
            ->line('New Status: ' . ucwords(str_replace('_', ' ', $this->application->status)));

        if ($this->comment) {
            $mail->line('Comments from the admission office:')
                 ->line($this->comment);
        }

        $mail->action('View Application', url('/student/applications/' . $this->application->id))
             ->line('Thank you for choosing UITM Poland!');

        if ($this->application->status === 'approved') {
            $mail->line('Next steps will be communicated to you shortly.');
        }

        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->application->id,
            'application_number' => $this->application->application_number,
            'old_status' => $this->oldStatus,
            'new_status' => $this->application->status,
            'comment' => $this->comment,
        ];
    }
}
