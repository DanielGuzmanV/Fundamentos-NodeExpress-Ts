import CategoriaModel from "../models/categoria.model.js";

const CategoriaService = {

  // Obtener todas las categorias
  listarCategorias: async() => {
    const categorias = await CategoriaModel.getAll();

    return categorias;
  },

  // Crear nueva categoria
  crearNuevaCategoria: async(nombre: string) => {
    if(!nombre) throw new Error("NOT_NAME");

    return await CategoriaModel.create(nombre);
  },

  // Actualizar una categoria
  actualizarCategoria: async(id: string | string[] | undefined, nombre: string) => {
    const idNumerico = Number(id);
    
    if(isNaN(idNumerico)) throw new Error("NOT_FOUND_ID")
    if(!nombre) throw new Error("NOT_NAME");

    const existId = await CategoriaModel.getById(idNumerico);

    if(!existId) throw new Error("CATEGORIA_NOT_FOUND");


    return await CategoriaModel.update(idNumerico, nombre);
  },

  // Ocultar una categoria
  OcultarCategoriaId: async(id: string | string[] | undefined) => {
    const idNumerico = Number(id);
    const categoria = await CategoriaModel.getById(idNumerico);

    if(isNaN(idNumerico)) throw new Error("NOT_FOUND_ID");
    if(!categoria) throw new Error("CATEGORIA_NOT_FOUND");

    return await CategoriaModel.deleteLogical(idNumerico);
  },

  // Mostrar una categoria oculta
  mostrarCategoriaId: async(id: string | string[] | undefined) => {
    const idNumerico = Number(id);
    if(isNaN(idNumerico)) throw new Error("NOT_FOUND_ID");
    
    const categoria = await CategoriaModel.getByIdSinFiltro(idNumerico)
    if(!categoria) {
      throw new Error("CATEGORIA_NOT_FOUND");
    }
    return await CategoriaModel.activarCategoria(idNumerico);
  }
}

export default CategoriaService;
