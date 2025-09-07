<?php

namespace App\Notifications;

use App\Models\Application;
use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentUploaded extends Notification implements ShouldQueue
{
    use Queueable;

    protected $application;
    protected $document;
    protected $uploadedBy;

    /**
     * Create a new notification instance.
     */
    public function __construct(Application $application, Document $document, string $uploadedBy = 'student')
    {
        $this->application = $application;
        $this->document = $document;
        $this->uploadedBy = $uploadedBy;
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
        $documentType = ucwords(str_replace('_', ' ', $this->document->type));

        if ($this->uploadedBy === 'student') {
            // Notification to admin
            return (new MailMessage)
                ->subject('New Document Uploaded - Application ' . $this->application->application_number)
                ->greeting('Hello,')
                ->line('A new document has been uploaded for application ' . $this->application->application_number)
                ->line('Student: ' . $this->application->user->name)
                ->line('Document Type: ' . $documentType)
                ->line('File Name: ' . $this->document->file_name)
                ->action('Review Application', url('/admin/applications/' . $this->application->id))
                ->line('Please review the document at your earliest convenience.');
        } else {
            // Notification to student about document status
            return (new MailMessage)
                ->subject('Document Review Update - ' . $this->application->application_number)
                ->greeting('Dear ' . $notifiable->name . ',')
                ->line('Your ' . $documentType . ' document has been reviewed.')
                ->line('Status: ' . ucwords($this->document->status))
                ->when($this->document->status === 'rejected', function ($mail) {
                    return $mail->line('Rejection Reason: ' . $this->document->rejection_reason)
                               ->line('Please upload a new document to proceed with your application.');
                })
                ->action('View Application', url('/student/applications/' . $this->application->id))
                ->line('Thank you for your cooperation.');
        }
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
            'document_id' => $this->document->id,
            'document_type' => $this->document->type,
            'uploaded_by' => $this->uploadedBy,
        ];
    }
}
