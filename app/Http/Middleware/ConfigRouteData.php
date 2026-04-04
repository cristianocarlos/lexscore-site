<?php

namespace App\Http\Middleware;

use App\Enums\RouteEnum;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Context;

class ConfigRouteData
{
    public function handle(Request $request, Closure $next): Response|JsonResponse|RedirectResponse {
        if ($request->is('api/*') or $request->is('docs/*')) { // if (request->expectsJson()) {
            $this->screenContextAdd();
            return $next($request);
        }

        if (!session('pg_random_seed')) session()->put('pg_random_seed', '0.' . time());

        $this->screenContextAdd();
        return $next($request);
    }

    private function screenContextAdd(): void {
        $routeUri = request()->route()->uri();
        $routePath = $routeUri === '/' ? $routeUri : '/' . $routeUri;

        $routeEnum = RouteEnum::tryFrom($routePath);
        if (!$routeEnum) throw new \Exception('Rota não configurada: ' . $routePath);

        Context::add('route_path', $routePath);
        Context::add('screen_enum', $routeEnum);
    }
}
