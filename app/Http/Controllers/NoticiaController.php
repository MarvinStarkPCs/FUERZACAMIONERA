<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoticiaController extends Controller
{
    public function index()
    {
        $noticias  = Noticia::where('tipo','noticia')->orderByDesc('fecha_inicio')->paginate(15);
        $normativa = Noticia::where('tipo','normativa')->orderByDesc('fecha_inicio')->paginate(15, ['*'], 'norm_page');

        return Inertia::render('Noticias/Index', compact('noticias','normativa'));
    }

    public function create()
    {
        return Inertia::render('Noticias/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titulo'            => 'required|string',
            'contenido'         => 'required|string',
            'tipo'              => 'required|in:noticia,normativa',
            'fecha_inicio'      => 'required|date',
            'fecha_vencimiento' => 'nullable|date|after:fecha_inicio',
            'activo'            => 'boolean',
            'archivo'           => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('archivo')) {
            $data['archivo'] = $request->file('archivo')->store('noticias', 'public');
        }

        $data['creado_por'] = auth()->id();
        Noticia::create($data);

        return redirect()->route('noticias.index')->with('success', 'Publicacion creada.');
    }

    public function edit(Noticia $noticia)
    {
        return Inertia::render('Noticias/Edit', ['noticia' => $noticia]);
    }

    public function update(Request $request, Noticia $noticia)
    {
        $data = $request->validate([
            'titulo'            => 'required|string',
            'contenido'         => 'required|string',
            'tipo'              => 'required|in:noticia,normativa',
            'fecha_inicio'      => 'required|date',
            'fecha_vencimiento' => 'nullable|date',
            'activo'            => 'boolean',
        ]);

        $noticia->update($data);
        return redirect()->route('noticias.index')->with('success', 'Publicacion actualizada.');
    }

    public function destroy(Noticia $noticia)
    {
        $noticia->delete();
        return redirect()->route('noticias.index')->with('success', 'Publicacion eliminada.');
    }
}
