<?php

namespace App\DTOs;

final class RouteNavDTO
{
    public function __construct(
        public string $apiDeleteUrl,
        public string $apiSaveUrl,
        public string $createUrl,
        public string $indexUrl,
        public string $updatePath,
    ) {}
}
