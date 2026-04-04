<?php

namespace App\Enums;

use App\DTOs\RouteNavDTO;
use Illuminate\Database\Eloquent\Model;

enum RouteEnum: string
{
    // PHPGEN

    case ROOT = '/'; // GET ☭ DefaultController@home
    case API_ERROR_BOUNDARY_LOG = '/api/error-boundary-log'; // POST ☭ Closure
    case API_NPS_SEND = '/api/nps/send'; // PUT ☭ DefaultController@npsSend
    case API_RD_MENTIRA = '/api/rd-mentira'; // POST ☭ DefaultController@rdMentiraSend
    case NPS = '/nps/{model}'; // GET ☭ DefaultController@npsForm
    case RD_MENTIRA = '/rd-mentira'; // GET ☭ DefaultController@rdMentiraForm

    // PHPGEN

    case API = '/api'; // Não é rota, só prefixo da api

    private function getRouteWithoutParams(): string {
        if (!str_contains($this->value, '/{')) return $this->value;
        return preg_replace('/\\/{.*?}/', '', $this->value); // remove os parametros ex.: {model}
    }

    private function getRouteParamsWithValues(): string {
        $path = '';
        foreach (request()->route()->parameters() as $routeParamValue) {
            $path .= '/' . ($routeParamValue instanceof Model ? $routeParamValue->getKey() : $routeParamValue);
        }
        return $path;
    }

    public function getRouteControllerPath(): string {
        $routeWithoutParamas = $this->getRouteWithoutParams();
        $parts = explode('/', $routeWithoutParamas);
        if (count($parts) > 2) return dirname($this->getRouteWithoutParams()); // /login /home
        return $routeWithoutParamas;
    }

    public function nav(): RouteNavDTO {
        $routeControllerPath = $this->getRouteControllerPath();
        $routePathWithoutParams = $this->getRouteWithoutParams();
        $routeParamsWithValues = $this->getRouteParamsWithValues();
        return new RouteNavDTO(
            apiDeleteUrl: self::API->value . "{$routeControllerPath}/delete{$routeParamsWithValues}",
            apiSaveUrl: self::API->value . "{$routePathWithoutParams}{$routeParamsWithValues}",
            createUrl: $routeControllerPath . '/create',
            indexUrl: $routeControllerPath . '/index',
            updatePath: $routeControllerPath . '/update',
        );
    }

    public static function getRouteWithoutParamsConstants(): array {
        $constants = [];
        foreach (self::cases() as $case) {
            if (!str_contains($case->value, '/{')) continue;
            $constants[$case->name] = $case->getRouteWithoutParams();
        }
        return $constants;
    }

    public function isPublic(): bool {
        return match ($this) {
            self::API,
            self::ROOT => true,
            default => false,
        };
    }

    /**
     * @return static[]
     */
    public static function privateCases(): array {
        $privateCases = [];
        foreach (self::cases() as $case) {
            if ($case->isPublic()) continue;
            $privateCases[] = $case;
        }
        return $privateCases;
    }

    // ###########
    // # Screen ##
    // ###########

    public function hasNav(): bool {
        return match ($this) {
            self::NPS,
            self::ROOT => false,
            default => true,
        };
    }

    public function titles(): ?array {
        // Sobrepõe o ControllerPathEnum
        return match ($this) {
            default => null,
        };
    }
}
