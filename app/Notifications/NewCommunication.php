<?php

namespace App\Notifications;

use App\Models\Communication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCommunication extends Notification implements ShouldQueue
{
    use Queueable;

    protected $communication;

    /**
     * Create a new notification instance.
     */
    public function __construct(Communication $communication)
    {
        $this->communication = $communication;
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
        $senderRole = $this->communication->sender->isAdmin() ? 'Admission Office' : 'Applicant';
        $applicationNumber = $this->communication->application->application_number;

        return (new MailMessage)
            ->subject($this->communication->subject . ' - Application ' . $applicationNumber)
            ->greeting('Dear ' . $notifiable->name . ',')
            ->line('You have received a new message regarding your application.')
            ->line('From: ' . $senderRole)
            ->line('Application: ' . $applicationNumber)
            ->line('Message:')
            ->line($this->communication->message)
            ->action('View Message', url('/student/applications/' . $this->communication->application_id . '/messages'))
            ->line('Please log in to your account to respond.')
            ->line('Thank you for using UITM Student Portal.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'communication_id' => $this->communication->id,
            'application_id' => $this->communication->application_id,
            'sender_id' => $this->communication->sender_id,
            'subject' => $this->communication->subject,
        ];
    }
}
