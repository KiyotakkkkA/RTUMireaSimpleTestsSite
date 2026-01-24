<?php

namespace App\Models\Test;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Test extends Model
{
    use SoftDeletes;

    protected $table = 'tests';
    protected $keyType = 'string';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'creator_id',
        'title',
        'total_questions',
    ];

    public $appends = ['is_current_user_creator'];

    public $incrementing = false;
    public $timestamps = true;

    public function getIsCurrentUserCreatorAttribute(): bool
    {
        return $this->creator_id === auth()->id();
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'test_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}
