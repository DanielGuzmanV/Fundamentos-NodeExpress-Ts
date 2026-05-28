import CategoriaModel from "../models/categoria.model.js";
import { AppError } from "../utils/AppError.js";

const CategoriaService = {

  // Obtener todas las categorias
  listarCategorias: async() => {
    const categorias = await CategoriaModel.getAll();

    return categorias;
  },

  // Obtener un categoria
  ObtenerUnCategoria: async (id: string[] | string | undefined) => {
    const idNum = Number(id);
    if(isNaN(idNum)) throw new AppError("ID no valido", 400);

    const categoria = await CategoriaModel.getById(idNum);
    if(!categoria) throw new AppError("Categoria no encontrada", 404);

    const {nombre, activo} = categoria;
    return {nombre, activo};
  },

  // Crear nueva categoria
  crearNuevaCategoria: async(nombre: string) => {
    if(!nombre) throw new AppError("El nombre es obligatorio", 400);

    return await CategoriaModel.create(nombre);
  },

  // Actualizar una categoria
  actualizarCategoria: async(id: string | string[] | undefined, nombre: string) => {
    const idNumerico = Number(id);
    
    if(isNaN(idNumerico)) throw new AppError("ID no valido", 404)
    if(!nombre) throw new AppError("El nuevo nombre es obligatorio", 400);

    const existId = await CategoriaModel.getById(idNumerico);
    if(!existId) throw new AppError("No se encontro la categoria con ese ID", 404);

    return await CategoriaModel.update(idNumerico, nombre);
  },

  // Ocultar una categoria
  OcultarCategoriaId: async(id: string | string[] | undefined) => {
    const idNumerico = Number(id);
    const categoria = await CategoriaModel.getById(idNumerico);

    if(isNaN(idNumerico)) throw new AppError("ID no valido", 404);
    if(!categoria) throw new AppError("La categoria no existe o ya esta oculta", 400);

    return await CategoriaModel.deleteLogical(idNumerico);
  },

  // Mostrar una categoria oculta
  mostrarCategoriaId: async(id: string | string[] | undefined) => {
    const idNumerico = Number(id);
    if(isNaN(idNumerico)) throw new AppError("ID no valido", 404);
    
    const categoria = await CategoriaModel.getByIdSinFiltro(idNumerico)
    if(!categoria) throw new AppError("La categoria ya esta activa o no existe", 400);

    return await CategoriaModel.activarCategoria(idNumerico);
  },

  eliminarCategoriaId: async(id: string | string[] | undefined) => {
    const idNumerico = Number(id);
    if(isNaN(idNumerico)) throw new AppError("ID no valido", 404);

    const categoria = await CategoriaModel.getById(idNumerico);
    if(!categoria) throw new AppError("No se encontro la categoria para eliminar", 404)
    
    return await CategoriaModel.deleteCategoria(idNumerico);
  },

  eliminarTablaCat: async() => {
    const total = await CategoriaModel.countAll();
    if(total === 0) throw new AppError("No se encontraron categorias para eliminar", 404);
    
    return await CategoriaModel.deleteAll();
  }
}

export default CategoriaService;
