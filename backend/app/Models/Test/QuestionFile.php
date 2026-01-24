<?php

namespace App\Models\Test;

use Illuminate\Database\Eloquent\Model;

class QuestionFile extends Model
{
    protected $table = 'question_files';

    protected $fillable = [
        'question_id',
        'name',
        'alias',
        'mime_type',
        'size',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
