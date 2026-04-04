<?php

namespace App\Services;

use App\Mail\RdMentiraMailable;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    public function rdMentiraSend(string $uuid, string $email): void {
        $host = request()->schemeAndHttpHost();
        $mailable = new RdMentiraMailable([
            'email' => $email,
            'link' => "{$host}/nps/{$uuid}",
            'subject' => 'NPS ' . config('mail.from.name'),
        ]);
        Mail::to($email)->send($mailable);
    }
}
