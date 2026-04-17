<?php

use App\Http\Controllers\AccionGremialController;
use App\Http\Controllers\ActuacionCasoController;
use App\Http\Controllers\AfiliadoController;
use App\Http\Controllers\CasoJuridicoController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\NoticiaController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QrController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rutas publicas
Route::get('/consulta', [QrController::class, 'consulta'])->name('consulta.publica');
Route::match(['get','post'], '/mi-cuenta', [QrController::class, 'privada'])->name('consulta.privada');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

// Dashboard
Route::get('/dashboard', function () {
    $afiliados = \App\Models\Afiliado::selectRaw("
        COUNT(*) as total,
        SUM(CASE WHEN estado='afiliado' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN estado='suspendido' THEN 1 ELSE 0 END) as suspendidos,
        SUM(CASE WHEN estado='no_afiliado' THEN 1 ELSE 0 END) as no_afiliados,
        SUM(deuda_total) as deuda_total
    ")->first();

    $casos = \App\Models\CasoJuridico::selectRaw("
        COUNT(*) as total,
        SUM(CASE WHEN estado IN ('abierto','en_proceso','conciliacion') THEN 1 ELSE 0 END) as en_curso,
        SUM(CASE WHEN estado='cerrado_exitoso' THEN 1 ELSE 0 END) as exitosos,
        SUM(valor_recuperado) as recuperado
    ")->first();

    $gastos_mes   = \App\Models\GastoAsociacion::whereMonth('fecha', now()->month)->whereYear('fecha', now()->year)->sum('valor');
    $ingresos_mes = \App\Models\Pago::whereMonth('fecha', now()->month)->whereYear('fecha', now()->year)->where('estado','pagado')->sum('valor');

    return Inertia::render('Dashboard', compact('afiliados','casos','gastos_mes','ingresos_mes'));
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Afiliados
    Route::middleware('permission:afiliados.ver')->group(function () {
        Route::get('/afiliados', [AfiliadoController::class, 'index'])->name('afiliados.index');
        Route::get('/afiliados/{afiliado}', [AfiliadoController::class, 'show'])->name('afiliados.show');
    });
    Route::middleware('permission:afiliados.crear')->group(function () {
        Route::get('/afiliados/create', [AfiliadoController::class, 'create'])->name('afiliados.create');
        Route::post('/afiliados', [AfiliadoController::class, 'store'])->name('afiliados.store');
    });
    Route::middleware('permission:afiliados.editar')->group(function () {
        Route::get('/afiliados/{afiliado}/edit', [AfiliadoController::class, 'edit'])->name('afiliados.edit');
        Route::put('/afiliados/{afiliado}', [AfiliadoController::class, 'update'])->name('afiliados.update');
    });
    Route::delete('/afiliados/{afiliado}', [AfiliadoController::class, 'destroy'])
        ->name('afiliados.destroy')
        ->middleware('permission:afiliados.eliminar');

    // Pagos
    Route::middleware('permission:pagos.ver')->group(function () {
        Route::get('/pagos', [PagoController::class, 'index'])->name('pagos.index');
    });
    Route::middleware('permission:pagos.crear')->group(function () {
        Route::get('/pagos/create', [PagoController::class, 'create'])->name('pagos.create');
        Route::post('/pagos', [PagoController::class, 'store'])->name('pagos.store');
    });
    Route::delete('/pagos/{pago}', [PagoController::class, 'destroy'])
        ->name('pagos.destroy')
        ->middleware('permission:pagos.eliminar');

    // Procesos juridicos
    Route::middleware('permission:juridico.ver')->group(function () {
        Route::get('/juridico', [CasoJuridicoController::class, 'index'])->name('juridico.index');
        Route::get('/juridico/{juridico}', [CasoJuridicoController::class, 'show'])->name('juridico.show');
    });
    Route::middleware('permission:juridico.crear')->group(function () {
        Route::get('/juridico/create', [CasoJuridicoController::class, 'create'])->name('juridico.create');
        Route::post('/juridico', [CasoJuridicoController::class, 'store'])->name('juridico.store');
        Route::post('/juridico/{juridico}/actuaciones', [ActuacionCasoController::class, 'store'])->name('actuaciones.store');
    });
    Route::middleware('permission:juridico.editar')->group(function () {
        Route::get('/juridico/{juridico}/edit', [CasoJuridicoController::class, 'edit'])->name('juridico.edit');
        Route::put('/juridico/{juridico}', [CasoJuridicoController::class, 'update'])->name('juridico.update');
        Route::patch('/actuaciones/{actuacion}', [ActuacionCasoController::class, 'update'])->name('actuaciones.update');
    });
    Route::delete('/juridico/{juridico}', [CasoJuridicoController::class, 'destroy'])
        ->name('juridico.destroy')
        ->middleware('permission:juridico.eliminar');

    // Acciones gremiales
    Route::middleware('permission:gremial.ver')->group(function () {
        Route::get('/gremial', [AccionGremialController::class, 'index'])->name('gremial.index');
    });
    Route::middleware('permission:gremial.crear')->group(function () {
        Route::get('/gremial/create', [AccionGremialController::class, 'create'])->name('gremial.create');
        Route::post('/gremial', [AccionGremialController::class, 'store'])->name('gremial.store');
    });
    Route::middleware('permission:gremial.editar')->group(function () {
        Route::get('/gremial/{gremial}/edit', [AccionGremialController::class, 'edit'])->name('gremial.edit');
        Route::put('/gremial/{gremial}', [AccionGremialController::class, 'update'])->name('gremial.update');
    });
    Route::delete('/gremial/{gremial}', [AccionGremialController::class, 'destroy'])
        ->name('gremial.destroy')
        ->middleware('permission:gremial.eliminar');

    // Gastos
    Route::middleware('permission:gastos.ver')->group(function () {
        Route::get('/gastos', [GastoController::class, 'index'])->name('gastos.index');
    });
    Route::middleware('permission:gastos.crear')->group(function () {
        Route::get('/gastos/create', [GastoController::class, 'create'])->name('gastos.create');
        Route::post('/gastos', [GastoController::class, 'store'])->name('gastos.store');
    });
    Route::delete('/gastos/{gasto}', [GastoController::class, 'destroy'])
        ->name('gastos.destroy')
        ->middleware('permission:gastos.eliminar');

    // Noticias
    Route::middleware('permission:noticias.ver')->group(function () {
        Route::get('/noticias', [NoticiaController::class, 'index'])->name('noticias.index');
    });
    Route::middleware('permission:noticias.crear')->group(function () {
        Route::get('/noticias/create', [NoticiaController::class, 'create'])->name('noticias.create');
        Route::post('/noticias', [NoticiaController::class, 'store'])->name('noticias.store');
    });
    Route::middleware('permission:noticias.editar')->group(function () {
        Route::get('/noticias/{noticia}/edit', [NoticiaController::class, 'edit'])->name('noticias.edit');
        Route::patch('/noticias/{noticia}', [NoticiaController::class, 'update'])->name('noticias.update');
    });
    Route::delete('/noticias/{noticia}', [NoticiaController::class, 'destroy'])
        ->name('noticias.destroy')
        ->middleware('permission:noticias.eliminar');

    // Usuarios (solo administrador)
    Route::middleware('permission:usuarios.ver')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
    });
    Route::middleware('permission:usuarios.crear')->group(function () {
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
    });
    Route::middleware('permission:usuarios.editar')->group(function () {
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    });
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->name('users.destroy')
        ->middleware('permission:usuarios.eliminar');
});

require __DIR__.'/auth.php';
