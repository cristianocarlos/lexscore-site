<?php

namespace App\Enums;

enum ControllerPathEnum: string
{
    // PHPGEN

    case ROOT = '/';
    case API = '/api';
    case API_NPS = '/api/nps';
    case NPS = '/nps';
    case RD_MENTIRA = '/rd-mentira';

    // PHPGEN

    public function titles(): ?array {
        // Sobreposto pelo RouteEnum
        return match ($this) {
            self::ROOT => [],
            default => null,
        };
    }
}
