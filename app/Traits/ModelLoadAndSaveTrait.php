<?php

namespace App\Traits;

trait ModelLoadAndSaveTrait
{
    private function getModelInput(): array {
        return request(class_basename($this));
    }

    /**
     * Carrega o request $model->update(request('ModelName'))) e salva o registro
     */
    public function loadAndCreate(): static {
        $this->fill($this->getModelInput());
        $this->save();
        return $this;
    }

    /**
     * Carrega o request $model->update(request('ModelName'))) e salva o registro
     */
    public function loadAndUpdate(): static {
        $this->fill($this->getModelInput());
        $this->save();
        return $this;
    }

    public function formFeaturesLoad(): array {
        $attributes = $this->exists
            ? $this->attributesToArray()
            : array_merge(array_fill_keys($this->getFillable(), null), $this->attributesToArray()); // todos os campos declarados + defaults
        $values = [
            class_basename($this) => $attributes,
        ];
        $relations = $this->getRelations();
        if (!empty($relations)) {
            foreach ($relations as $relationModel) {
                $values[class_basename($relationModel)] = $relationModel->attributesToArray();
            }
        }
        return [
            'recordId' => $this->getKey(),
            'values' => $values,
        ];
    }
}
