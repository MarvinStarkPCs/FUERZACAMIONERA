<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactoSolicitante extends Model
{
    protected $table = 'contactos_solicitantes';
    protected $fillable = ['nombre','cedula','telefono'];
}
