<?php

namespace App\Console\Commands;

use App\Enums\RouteEnum;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;

class RouteEnumGen extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'route-enum:gen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate route enums and routes on database for RBAC access control';

    /**
     * Execute the console command.
     */
    public function handle(): void {
        $this->phpRouteEnums(base_path() . '/app/Enums/RouteEnum.php');
        $this->phpControllerPathEnums(base_path() . '/app/Enums/ControllerPathEnum.php');
    }

    private function phpRouteEnums(string $phpFileName): void {
        $routeCollection = Route::getRoutes();
        $code = PHP_EOL . PHP_EOL;
        $sortedRoutes = collect($routeCollection)->sortBy(function ($route) {
            return $route->uri(); // Sort by URI path
        });
        foreach ($sortedRoutes as $route) {
            $uri = $route->uri();
            if ($uri === 'up') continue;
            if (str_starts_with($uri, 'docs/')) continue;
            if (str_starts_with($uri, 'storage/')) continue; // App\Http\Controllers\
            $actionName = str_replace('App\Http\Controllers\\', '', $route->getActionName());
            $comment = "// {$route->methods()[0]} ☭ {$actionName}";
            if ($uri === '/') {
                $code .= "    case ROOT = '/'; {$comment}" . PHP_EOL;
                continue;
            }
            $uri = preg_replace('/\\/{.*?}/', '', $uri); // remove os parametros ex.: {model}
            $uriCase = mb_strtoupper(str_replace(['/', '-', '.'], '_', $uri)); // transforma em formato de constante
            $code .= "    case {$uriCase} = '/{$route->uri()}'; {$comment}" . PHP_EOL;
        }
        $code .= PHP_EOL . '    // ';
        $currentContent = file_get_contents($phpFileName);
        $newContent = preg_replace('/(PHPGEN)(.*?)(PHPGEN)/si', '$1' . $code . '$3', $currentContent);
        file_put_contents($phpFileName, $newContent);
    }

    private function phpControllerPathEnums(string $phpFileName): void {
        $controllerPaths = [];
        foreach (RouteEnum::cases() as $case) {
            $controllerPaths[] = $case->getRouteControllerPath();
        }
        $controllerPaths = array_unique($controllerPaths);
        $code = PHP_EOL . PHP_EOL;
        foreach ($controllerPaths as $controllerPath) {
            if ($controllerPath === '/') {
                $code .= "    case ROOT = '/';" . PHP_EOL;
                continue;
            }
            $uriCase = mb_strtoupper(str_replace(['/', '-'], '_', mb_ltrim($controllerPath, '/')));
            $code .= "    case {$uriCase} = '{$controllerPath}';" . PHP_EOL;
        }
        $code .= PHP_EOL . '    // ';
        $currentContent = file_get_contents($phpFileName);
        $newContent = preg_replace('/(PHPGEN)(.*?)(PHPGEN)/si', '$1' . $code . '$3', $currentContent);
        file_put_contents($phpFileName, $newContent);
    }
}
