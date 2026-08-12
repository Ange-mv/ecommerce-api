const { Categoria, Producto } = require("../models");
const AppError = require("../utils/AppError");

const {
  obtenerIdValido,
} = require("../utils/validaciones");


// ========================================
// OBTENER TODAS LAS CATEGORÍAS
// ========================================

async function obtenerCategorias(req, res, next) {
  try {
    const categorias = await Categoria.findAll({
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      ok: true,
      categorias,
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// OBTENER CATEGORÍA POR ID
// ========================================

async function obtenerCategoriaPorId(req, res, next) {
  try {
    const id =
  obtenerIdValido(
    req.params.id
  );

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      throw new AppError(
        "Categoría no encontrada",
        404
      );
    }

    res.status(200).json({
      ok: true,
      categoria,
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// CREAR CATEGORÍA
// ========================================

async function crearCategoria(req, res, next) {
  try {
    const { nombre } = req.body;

    // Validar nombre
    if (!nombre || !nombre.trim()) {
      throw new AppError(
        "El nombre de la categoría es obligatorio",
        400
      );
    }

    // Comprobar duplicado
    const categoriaExistente =
      await Categoria.findOne({
        where: {
          nombre: nombre.trim(),
        },
      });

    if (categoriaExistente) {
      throw new AppError(
        "La categoría ya existe",
        400
      );
    }

    // Crear
    const nuevaCategoria =
      await Categoria.create({
        nombre: nombre.trim(),
      });

    res.status(201).json({
      ok: true,
      message:
        "Categoría creada correctamente",
      categoria: nuevaCategoria,
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// ACTUALIZAR CATEGORÍA
// ========================================

async function actualizarCategoria(req, res, next) {
  try {
    const id =
  obtenerIdValido(
    req.params.id
  );
    const { nombre } = req.body;

    // Validar nombre
    if (!nombre || !nombre.trim()) {
      throw new AppError(
        "El nombre de la categoría es obligatorio",
        400
      );
    }

    // Buscar categoría
    const categoria =
      await Categoria.findByPk(id);

    if (!categoria) {
      throw new AppError(
        "Categoría no encontrada",
        404
      );
    }

    // Comprobar si otra categoría
    // ya utiliza ese nombre
    const categoriaExistente =
      await Categoria.findOne({
        where: {
          nombre: nombre.trim(),
        },
      });

    if (
      categoriaExistente &&
      categoriaExistente.id !== categoria.id
    ) {
      throw new AppError(
        "Ya existe una categoría con ese nombre",
        400
      );
    }

    // Actualizar
    await categoria.update({
      nombre: nombre.trim(),
    });

    res.status(200).json({
      ok: true,
      message:
        "Categoría actualizada correctamente",
      categoria,
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// ELIMINAR CATEGORÍA
// ========================================

async function eliminarCategoria(req, res, next) {
  try {
    const id =
  obtenerIdValido(
    req.params.id
  );

    // Buscar categoría
    const categoria =
      await Categoria.findByPk(id);

    if (!categoria) {
      throw new AppError(
        "Categoría no encontrada",
        404
      );
    }

    // Comprobar productos asociados
    const cantidadProductos =
      await Producto.count({
        where: {
          categoria_id: id,
        },
      });

    if (cantidadProductos > 0) {
      throw new AppError(
        "No se puede eliminar la categoría porque tiene productos asociados",
        409
      );
    }

    // Eliminar
    await categoria.destroy();

    res.status(200).json({
      ok: true,
      message:
        "Categoría eliminada correctamente",
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// EXPORTAR FUNCIONES
// ========================================

module.exports = {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};