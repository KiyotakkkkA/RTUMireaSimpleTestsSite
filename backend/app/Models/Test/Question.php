<?php

namespace App\Models\Test;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';

    protected $fillable = [
        'test_id',
        'title',
        'type',
        'options'
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public $timestamps = true;

    public function test()
    {
        return $this->belongsTo(Test::class, 'test_id'); 
    }

    public function files()
    {
        return $this->hasMany(QuestionFile::class, 'question_id');
    }
}
