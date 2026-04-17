<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // --- Permisos ---
        $permisos = [
            // Afiliados
            'afiliados.ver',
            'afiliados.crear',
            'afiliados.editar',
            'afiliados.eliminar',

            // Pagos
            'pagos.ver',
            'pagos.crear',
            'pagos.eliminar',

            // Procesos juridicos
            'juridico.ver',
            'juridico.crear',
            'juridico.editar',
            'juridico.eliminar',

            // Acciones gremiales
            'gremial.ver',
            'gremial.crear',
            'gremial.editar',
            'gremial.eliminar',

            // Gastos
            'gastos.ver',
            'gastos.crear',
            'gastos.eliminar',

            // Noticias
            'noticias.ver',
            'noticias.crear',
            'noticias.editar',
            'noticias.eliminar',

            // Usuarios
            'usuarios.ver',
            'usuarios.crear',
            'usuarios.editar',
            'usuarios.eliminar',

            // Reportes
            'reportes.ver',
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso]);
        }

        // --- Roles ---

        // Administrador: todo
        $administrador = Role::firstOrCreate(['name' => 'administrador']);
        $administrador->syncPermissions($permisos);

        // Coordinador: todo excepto eliminar usuarios
        $coordinador = Role::firstOrCreate(['name' => 'coordinador']);
        $coordinador->syncPermissions([
            'afiliados.ver','afiliados.crear','afiliados.editar','afiliados.eliminar',
            'pagos.ver','pagos.crear','pagos.eliminar',
            'juridico.ver','juridico.crear','juridico.editar',
            'gremial.ver','gremial.crear','gremial.editar','gremial.eliminar',
            'gastos.ver','gastos.crear','gastos.eliminar',
            'noticias.ver','noticias.crear','noticias.editar','noticias.eliminar',
            'usuarios.ver',
            'reportes.ver',
        ]);

        // Auxiliar: afiliados, pagos, noticias (sin eliminar)
        $auxiliar = Role::firstOrCreate(['name' => 'auxiliar']);
        $auxiliar->syncPermissions([
            'afiliados.ver','afiliados.crear','afiliados.editar',
            'pagos.ver','pagos.crear',
            'noticias.ver',
            'reportes.ver',
        ]);

        // Juridico: casos juridicos + ver afiliados
        $juridico = Role::firstOrCreate(['name' => 'juridico']);
        $juridico->syncPermissions([
            'afiliados.ver',
            'pagos.ver',
            'juridico.ver','juridico.crear','juridico.editar',
            'gremial.ver',
            'reportes.ver',
        ]);

        // Afiliado: solo consulta publica (sin acceso al panel)
        $afiliado = Role::firstOrCreate(['name' => 'afiliado']);
        $afiliado->syncPermissions([]);

        // --- Asignar roles a usuarios existentes ---
        User::all()->each(function (User $user) {
            // Asignar rol de Spatie segun el campo role del usuario
            $user->syncRoles([$user->role]);
        });

        $this->command->info('Roles y permisos creados correctamente.');
    }
}
