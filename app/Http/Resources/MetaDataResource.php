<?php

namespace App\Http\Resources;

use App\Enums\ControllerPathEnum;
use App\Enums\RouteEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MetaDataResource extends JsonResource
{
    private ?string $parentControllerPath;
    private ?int $parentId;
    private ?string $childControllerPath;

    public function __construct($resource, $parentControllerPath = null, $parentId = null, $childControllerPath = null) {
        parent::__construct($resource);
        $this->parentControllerPath = $parentControllerPath;
        $this->parentId = $parentId;
        $this->childControllerPath = $childControllerPath;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        /** @var RouteEnum $routeEnum */
        $routeEnum = context('screen_enum');

        $screenControllerPath = $routeEnum->getRouteControllerPath();
        $screenHasNav = $routeEnum->hasNav();
        $screenTitles = $routeEnum->titles();

        if (empty($screenTitles)) {
            /** @var ControllerPathEnum $controllerPathEnum */
            $controllerPathEnum = ControllerPathEnum::tryFrom($screenControllerPath);
            $screenTitles = $controllerPathEnum?->titles();
        }

        $data = [
            'additional' => $this->additional,
            'controllerPath' => $screenControllerPath,
            'pgRandomSeed' => session('pg_random_seed'),
            'routeParams' => request()->route()->parameters(),
            'screenId' => $routeEnum->value,
            'titles' => $this->whenNotNull($screenTitles),
        ];

        //

        $navData = [];
        if ($this->resource === null) { // índices
            if ($screenHasNav) {
                $screenNav = $routeEnum->nav();
                $navData = [
                    'breadCrumbs' => [literal(label: 'Novo registro', path: $screenNav->createUrl)],
                    'updatePath' => $screenNav->updatePath,
                ];
            }
            return array_merge($data, $navData);
        }

        //

        if ($screenHasNav) {
            $screenNav = $routeEnum->nav();
            $parentNav = $this->getParentNav();
            $navData = [
                'apiSaveUrl' => $screenNav->apiSaveUrl,
                'apiDeleteUrl' => $screenNav->apiDeleteUrl,
                'childNav' => $this->getChildNav(),
                'breadCrumbs' => $this->getBreadCrumbs($screenControllerPath, $parentNav),
                'createUrl' => $screenNav->createUrl,
                'parentNav' => $parentNav,
                'redirectUrl' => $parentNav['redirectUrl'] ?? $screenNav->indexUrl,
            ];
        }
        return array_merge($data, $navData, ['routeParamId' => $this->whenNotNull($this->getRouteKey())]);
    }

    private function getBreadCrumbs(string $controllerPath, ?array $parentNav): ?array {
        /** @var Model $model */
        $model = $this->resource;
        if (!method_exists($model, 'getBreadCrumbName')) {
            throw new \Exception('É necessário declarar um método getBreadCrumbName no model ou setar a rota como false no RouteEnum::hasNav');
        }
        if (!empty($parentNav)) {
            if ($model->exists) {
                return [
                    literal(label: 'Voltar', path: $parentNav['redirectUrl']),
                    literal(label: $model->getBreadCrumbName()),
                ];
            }
            return [
                literal(label: 'Voltar', path: $parentNav['redirectUrl']),
                literal(label: 'Novo registro'),
            ];
        }
        if ($model->exists) {
            return [
                literal(label: 'Índice', path: $controllerPath . '/index'),
                literal(label: $model->getBreadCrumbName()),
            ];
        }
        return [
            literal(label: 'Índice', path: $controllerPath . '/index'),
            literal(label: 'Novo registro'),
        ];
    }

    private function getChildNav(): ?array {
        if (!$this->childControllerPath) return null;
        return [
            'createUrl' => $this->childControllerPath . '/create/' . $this->getRouteKey(),
            'updatePath' => $this->childControllerPath . '/update',
        ];
    }

    private function getParentNav(): ?array {
        if (!$this->parentControllerPath) return null;
        if (!$this->parentId) throw new \Exception('Preciiisooo');
        return [
            'redirectUrl' => $this->parentControllerPath . '/update/' . $this->parentId,
        ];
    }
}
