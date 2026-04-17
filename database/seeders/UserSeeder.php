<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = [
            [
                'name'     => 'Administrador Principal',
                'email'    => 'admin@fuerzacamionera.com',
                'password' => Hash::make('admin1234'),
                'role'     => 'administrador',
                'activo'   => true,
            ],
            [
                'name'     => 'Coordinador General',
                'email'    => 'coordinador@fuerzacamionera.com',
                'password' => Hash::make('coord1234'),
                'role'     => 'coordinador',
                'activo'   => true,
            ],
            [
                'name'     => 'Auxiliar Administrativo',
                'email'    => 'auxiliar@fuerzacamionera.com',
                'password' => Hash::make('aux1234'),
                'role'     => 'auxiliar',
                'activo'   => true,
            ],
            [
                'name'     => 'Abogado Juridico',
                'email'    => 'juridico@fuerzacamionera.com',
                'password' => Hash::make('jur1234'),
                'role'     => 'juridico',
                'activo'   => true,
            ],
            [
                'name'     => 'Usuario Prueba Afiliado',
                'email'    => 'afiliado@fuerzacamionera.com',
                'password' => Hash::make('afi1234'),
                'role'     => 'afiliado',
                'activo'   => true,
            ],
        ];

        foreach ($usuarios as $usuario) {
            User::updateOrCreate(
                ['email' => $usuario['email']],
                $usuario
            );
        }
    }
}
