<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Communication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunicationController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Communication $communication)
    {
        // Verify the communication is for the authenticated user
        if ($communication->recipient_id !== auth()->id()) {
            abort(403);
        }

        // Mark as read if not already
        if (!$communication->is_read) {
            $communication->update([
                'is_read' => true,
                'read_at' => now()
            ]);
        }

        $communication->load(['sender', 'application.program']);

        return Inertia::render('Student/Communications/Show', [
            'communication' => $communication,
        ]);
    }

    /**
     * Reply to a communication
     */
    public function reply(Request $request, Communication $communication)
    {
        // Verify the communication is for the authenticated user
        if ($communication->recipient_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'message' => 'required|string|min:10',
        ]);

        // Create a reply
        $reply = Communication::create([
            'application_id' => $communication->application_id,
            'sender_id' => auth()->id(),
            'recipient_id' => $communication->sender_id, // Reply to the sender
            'subject' => 'Re: ' . $communication->subject,
            'message' => $request->message,
            'type' => 'internal_message',
            'parent_id' => $communication->id,
        ]);

        return redirect()->route('student.communications.show', $reply)
            ->with('success', 'Reply sent successfully.');
    }
}
