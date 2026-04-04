<?php

namespace App\Models\main;

use App\Traits\ModelLoadAndSaveTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RespondentMailingList extends Model
{
    use ModelLoadAndSaveTrait;

    protected $table = 'main.respondent_mailing_list';
    protected $primaryKey = 'reml_uuid';
    protected $keyType = 'string';
    public $timestamps = false;
    protected $hidden = [];
    protected $attributes = [];
    protected $casts = [];
    protected $fillable = [
        'reml_pers_name',
        'reml_pers_joti',
        'reml_comp_name',
    ];
    protected $appends = [];

    public function respondentRelation(): BelongsTo {
        return $this->belongsTo(Respondent::class, 'reml_resp');
    }
}
